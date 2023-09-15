/* eslint-disable no-useless-catch */
import { v4 as uuidv4 } from 'uuid';
import { CustomError } from '@helpers/customError';
import { FastifyReply } from 'fastify';
import { ScbApiService } from '@domain/scbApi/services/scbApi';
import { AuthUserHook } from '@hooks/authUser';
import { AccountTopupTransformer } from '@transformer/accountTopup';
import { TopupHistoryService } from '@domain/topup/services/topupHistories';
import { TopupStatusEnum, TopupTypeEnum, getTopupBillerId } from '@enums/topupEnum';
import Decimal from 'decimal.js';
import { FeeSysController } from './feeSys';
import { FeeSysStatusEnum, FeeSysTnxTypeEnum, FeeSysTypeEnum } from '@enums/feeSysEnum';
import { config } from '@config/config';
import { LineNotifyService } from '@domain/notify/service/lineNofify';
import { DateHelper } from '@helpers/date';
import { BankAccountService } from '@domain/account/services/bankAccounts';

export namespace AccountTopupController {
    export const createAccountTopup = async (request: AccountTopupTransformer.createAccountTopup.Request, reply: FastifyReply) => {

        const reqUser = AuthUserHook.getUserApi(request);
        const newRequestId = uuidv4();

        const {
            type,
            toNumber,
            amount,
            note,
        } = request.body;

        const nowThai = DateHelper.getNowThai();
        try {



            const dAmount = new Decimal(amount);
            let aFee: string | null = null;
            const aNetAmount = `${dAmount.toFixed(2)}`;

            const accountSummary = await ScbApiService.getAccountSummary(reqUser, reqUser.bankAccountActive);
            if (!accountSummary) {
                throw new CustomError({
                    statusCode: 503,
                    message: 'unable to get account summary',
                });
            }

            // let accountSummary = await ScbApiService.getAccountSummary(reqUser);
            // if (!accountSummary) {
            //     throw new CustomError({
            //         statusCode: 503,
            //         message: 'unable to get account summary',
            //     });
            // }
            let availableBalance = Number(accountSummary.data.availableBalance || 0);
            // const nowThai = DateHelper.getNowThai();
            // await LineNotifyService.sendNotify(`รายงานสถานะยอดเงินสำรองคงเหลือ\nบัญชี ${reqUser.bankAccountNoView}\nยอดปัจจุปัน คงเหลือ ${availableBalance} บาท\n${nowThai}`);

            const bankAccountBalance = Number(new Decimal(availableBalance).toFixed(2));
            await BankAccountService.updateOneByCondition(
                {
                    bankAccountNo: reqUser.bankAccountActive.bankAccountNo,
                },
                {
                    bankAccountBalance,
                }
            );

            if (Number(availableBalance) < Number(dAmount.toFixed(2))) {
                throw new CustomError({
                    statusCode: 422,
                    message: 'NOT_ENOUGH_BALANCE',
                });
            }

            // const validateMinAvailableBalance = config.MIN_ACCOUNT_BALANCE_NOTIFY;
            // if (Number(availableBalance) < Number(validateMinAvailableBalance)) {
            //     await LineNotifyService.sendNotify(`ยอดเงินเหลือน้อยกรุณาเติมเงิน \nบัญชี SCB ${reqUser.bankAccountNoView} \nยอดเงินที่ใช้ได้ ${availableBalance} บาท`);
            // }


            const createTopupHistoryId = await TopupHistoryService.createOne({
                requestId: newRequestId,
                serviceName: reqUser.serviceName,
                bankAppId: reqUser.bankApp.id,
                bankAccountId: reqUser.bankAccountActive.id,

                type,
                status: TopupStatusEnum.PENDING,

                amount: aNetAmount,
                fee: aFee,
                netAmount: null,

                feeSysId: null,
                feeSysTxnBatch: null,

                payer: reqUser.bankAccountActive.bankAccountNo,
                payee: null,

                startAt: null,
                txnAt: null,
                endAt: null,

                data: null,
                thirdPartRequestId: null,
                thirdPartRequestData: null,
                thirdPartResponseData: null,
                thirdPartWebHookData: null,
                remark: null,
            });

            const billerId = getTopupBillerId(type);
            const createTopupToNumber = await ScbApiService.createTopupToNumber(
                reqUser,
                {
                    billerId,
                    toNumber,
                    amount: aNetAmount,
                    note,
                },
            );

            const { topupCreate, topupConfirmation } = createTopupToNumber;
            if (topupCreate.status.code === 1000 && topupConfirmation && topupConfirmation.status.code === 1000) {
                const notifyMessages = [
                    `✅ ทำรายการสำเร็จ: เติมเงิน:ทรูมันนี่วอลเล็ท\n`,
                    `ไอดี: ${newRequestId} \n`,
                    `\n`,
                    `🏛 SCB บัญชี ${reqUser.bankAccountActive.bankAccountNoView}\n`,
                    reqUser.bankAccountActive?.bankBranchName ? `สาขา ${reqUser.bankAccountActive.bankBranchName}\n` : '',
                    `\n`,
                    `บริการ: เติมเงิน:ทรูมันนี่วอลเล็ท \n`,
                    `\n`,
                    ` เบอร์โทรศัพท์: ${toNumber}\n`,
                    ` จำนวนเงิน: ${new Decimal(amount).toFixed(2)} บาท\n`,
                    // ` ค่าบริการ: ${new Decimal(0).toFixed(2)} บาท\n`,
                    `\n`,
                    `ยอดเงินคงเหลือ ${new Decimal((Number(availableBalance) - Number(amount))).toFixed(2)} บาท\n`,
                    `🗓 ${nowThai}`,
                ];

                await LineNotifyService.sendNotify(
                    reqUser,
                    `${notifyMessages.join('')}`,
                );

                await TopupHistoryService.updateOneById(createTopupHistoryId, {
                    status: TopupStatusEnum.SUCCESS,
                    thirdPartResponseData: JSON.stringify({
                        topupCreate,
                        topupConfirmation,
                    }),
                    netAmount: aNetAmount,
                    payee: topupCreate.data.refNo1,
                    txnAt: new Date(topupConfirmation.data.tranDateTime),
                    remark: `tranDateTime: ${topupConfirmation?.data?.tranDateTime}`,
                });
                await BankAccountService.updateDownNumberById(
                    reqUser.bankAccountActive.id,
                    {
                        column: 'bankAccountBalance',
                        down: Number(amount),
                    }
                );

                await BankAccountService.updatePushNumberById(
                    reqUser.bankAccountActive.id,
                    {
                        column: 'todayTopUpTruemoneyBalance',
                        push: Number(amount),
                    }
                );
            } else {
                await TopupHistoryService.updateOneById(createTopupHistoryId, {
                    status: TopupStatusEnum.ERROR,
                    thirdPartResponseData: JSON.stringify({
                        topupCreate,
                        topupConfirmation,
                    }),
                    txnAt: null,
                    netAmount: null,
                    payee: null,
                    remark: ``,
                });

                throw new CustomError({
                    statusCode: 503,
                    message: `ScbApi Error: topup ${JSON.stringify(
                        topupConfirmation || topupCreate,
                    )}`,
                });
            }

            const newTopupHistory = await TopupHistoryService.getOneByCondition({
                id: createTopupHistoryId,
            });
            if (!newTopupHistory) {
                throw new CustomError({
                    statusCode: 500,
                    message: `topupHistories not found id = ${createTopupHistoryId}`,
                });
            }

            const resp: AccountTopupTransformer.createAccountTopup.ResponseData = newTopupHistory;
            return reply.send(resp);
        } catch (error) {
            const accountSummary = await ScbApiService.getAccountSummary(reqUser, reqUser.bankAccountActive);
            if (!accountSummary) {
                throw new CustomError({
                    statusCode: 503,
                    message: 'unable to get account summary',
                });
            }
            const availableBalance = Number(accountSummary.data.availableBalance || 0);

            let isNotEnoughBalance = false;
            if (error instanceof CustomError) {
                if (error.message == 'NOT_ENOUGH_BALANCE') {
                    isNotEnoughBalance = true;
                }
            }
            const notifyMessages = [
                `❌ ทำรายการไม่สำเร็จ: เติมเงิน:ทรูมันนี่วอลเล็ท\n`,
                `ไอดี: ${newRequestId} \n`,
                `\n`,
                `🏛 SCB บัญชี ${reqUser.bankAccountActive.bankAccountNoView}\n`,
                reqUser.bankAccountActive?.bankBranchName ? `สาขา ${reqUser.bankAccountActive.bankBranchName}\n` : '',
                `\n`,
                `บริการ: เติมเงิน:ทรูมันนี่วอลเล็ท \n`,
                `\n`,
                ` เบอร์โทรศัพท์: ${toNumber}\n`,
                ` จำนวนเงิน: ${new Decimal(amount).toFixed(2)} บาท\n`,
                // ` ค่าบริการ: ${new Decimal(0).toFixed(2)} บาท\n`,
                `\n`,
                `ยอดเงินคงเหลือ ${new Decimal(Number(availableBalance)).toFixed(2)} บาท\n`,
                `🗓 ${nowThai}`,
                isNotEnoughBalance ? `\n\n❗ยอดเงินคงเหลือไม่เพียงพอ กรุณาเติมเงิน\n` : '',
            ];
            await LineNotifyService.sendNotify(
                reqUser,
                `${notifyMessages.join('')}`,
            );
            throw error;
        }
    };

    export const getAccountTopupConfig = async (request: AccountTopupTransformer.getAccountTopupConfig.Request, reply: FastifyReply) => {
        try {
            const reqUser = AuthUserHook.getUserApi(request);

            const topupConfig = await ScbApiService.getTopupConfig(reqUser);

            const resp: AccountTopupTransformer.getAccountTopupConfig.ResponseData = topupConfig;
            return reply.send(resp);
        } catch (error) {
            throw error;
        }
    };
}
