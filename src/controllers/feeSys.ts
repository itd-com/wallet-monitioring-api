/* eslint-disable no-useless-catch */
import { CustomError } from '@helpers/customError';
import { ScbApiService } from '@domain/scbApi/services/scbApi';
import { TopupTypeEnum, getTopupBillerId } from '@enums/topupEnum';
import { FeeSysTransformer } from '@transformer/feeSys';
import { FeeSysHistoryService } from '@domain/feeSys/services/feeSysHistories';
import { FeeSysStatusEnum } from '@enums/feeSysEnum';
import { config } from '@config/config';
import { BankTransferStatusEnum } from '@enums/bankTransferEnum';

export namespace FeeSysController {
    export const createFeeSysToEWalletTxn = async (request: FeeSysTransformer.createFeeSysToEWalletTxn.Request): Promise<FeeSysTransformer.createFeeSysToEWalletTxn.ResponseData> => {
        try {
            const {
                reqUser,
                param,
                data,
            } = request;

            const createTopupHistoryId = await FeeSysHistoryService.createOne(data);

            const billerId = getTopupBillerId(TopupTypeEnum.E_WALLET);
            const createTopupToNumber = await ScbApiService.createTopupToNumber(
                reqUser,
                {
                    billerId,
                    toNumber: `${config.FEE_SYS_E_WALLET_NUMBER}`,
                    amount: param.amount,
                    note: param.note || 'system_fee',
                },
            );

            const { topupCreate, topupConfirmation } = createTopupToNumber;
            if (topupCreate.status.code === 1000 && topupConfirmation && topupConfirmation.status.code === 1000) {
                await FeeSysHistoryService.updateOneById(createTopupHistoryId, {
                    status: BankTransferStatusEnum.SUCCESS,
                    thirdPartResponseData: JSON.stringify({
                        topupCreate,
                        topupConfirmation,
                    }),
                    txnAt: new Date(topupConfirmation.data.tranDateTime),
                    fee: `${Number(topupCreate.data.fee) ?? '0.00'}`,
                    netAmount: param.amount,
                    payeeNo: topupCreate.data.refNo1,
                    remark: `tranDateTime: ${topupConfirmation?.data?.tranDateTime}`,
                });
            } else {
                await FeeSysHistoryService.updateOneById(createTopupHistoryId, {
                    status: BankTransferStatusEnum.ERROR,
                    thirdPartResponseData: JSON.stringify({
                        topupCreate,
                        topupConfirmation,
                    }),
                    txnAt: null,
                    fee: null,
                    netAmount: null,
                    payeeNo: null,
                    remark: ``,
                });

                throw new CustomError({
                    statusCode: 503,
                    message: `ScbApi Error: topup ${JSON.stringify(
                        topupConfirmation || topupCreate,
                    )}`,
                });
            }

            const newFeeSysHistory = await FeeSysHistoryService.getOneByCondition({
                id: createTopupHistoryId,
            });
            if (!newFeeSysHistory) {
                throw new CustomError({
                    statusCode: 500,
                    message: `feeSysHistories not found id = ${createTopupHistoryId}`,
                });
            }

            return newFeeSysHistory;
        } catch (error) {
            throw error;
        }
    };
}
