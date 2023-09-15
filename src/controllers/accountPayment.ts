/* eslint-disable no-useless-catch */
import { v4 as uuidv4 } from 'uuid';
import { addHours, addMinutes, differenceInSeconds, parseISO, previousDay } from 'date-fns';
import { format } from 'date-fns-tz';
import { CustomError } from '@helpers/customError';
import { FastifyReply } from 'fastify';
import { ScbApiService } from '@domain/scbApi/services/scbApi';
import { AuthUserHook } from '@hooks/authUser';
import { PaymentHistoryService } from '@domain/qrPayment/services/qrPaymentHistories';
import { PaymentStatusEnum, PaymentTypeEnum } from '@enums/paymentEnum';
import { UniqueRandomGenerator } from '@helpers/uniqueRandomGenerator';
import { AccountPaymentTransformer } from '@transformer/accountPayment';
import { config } from '@config/config';
import { BankAppService } from '@domain/account/services/bankApps';
import { FeeSysController } from './feeSys';
import { FeeSysStatusEnum, FeeSysTnxTypeEnum, FeeSysTypeEnum } from '@enums/feeSysEnum';
import Decimal from 'decimal.js';
import { BankApp } from '@domain/account/models/bankApps';

export namespace AccountPaymentController {
	export const createQrPayment = async (request: AccountPaymentTransformer.createQrPayment.Request, reply: FastifyReply) => {
		try {
			const reqUser = AuthUserHook.getUserApi(request);

			const { amount } = request.body;
			if (isNaN(Number(amount))) {
				throw new CustomError({
					statusCode: 422,
					message: 'AMOUNT_INVALID',
				});
			}

			if (!Number.isInteger(Number(amount))) {
				throw new CustomError({
					statusCode: 422,
					message: 'AMOUNT_MUST_BE_INTEGER',
				});
			}

			const removeKeyUsed = [];
			const uniqueRandomGenerator = new UniqueRandomGenerator(100, [...removeKeyUsed]);
			const requestMemo = uniqueRandomGenerator.generate();
			if (!requestMemo) {
				throw new CustomError({
					statusCode: 422,
					message: 'TRANSACTIONS_LIMIT',
				});
			}
			const amountMemo = `${Math.round(Number(amount))}.${`${requestMemo}`.length === 1 ? `${requestMemo}0` : requestMemo}`;

			let qrCodePaymentURL: string | null = null;
			if (reqUser.bankAccountActive.bankPromptPayNo) {
				qrCodePaymentURL = await ScbApiService.getAccountQrCodePaymentURL(
					reqUser,
					{
						amount: amountMemo,
					},
				);
			}

			const dAmount = new Decimal(amountMemo);
			const aNetAmount = `${dAmount.toFixed(2)}`;

			const newRequestId = uuidv4();
			const createPaymentHistoryId = await PaymentHistoryService.createOne({
				requestId: newRequestId,
				serviceName: reqUser.serviceName,
				bankAppId: reqUser.bankApp.id,
				bankAccountId: reqUser.bankAccountActive.id,

				type: PaymentTypeEnum.QR_CODE_PAYMENT,
				status: PaymentStatusEnum.PENDING,

				amount: aNetAmount,
				fee: null,
				netAmount: null,

				feeSysId: null,
				feeSysTxnBatch: null,

				payer: null,
				payee: reqUser.bankAccountActive.bankAccountNo,

				startAt: new Date(),
				txnAt: null,
				endAt: addMinutes(new Date(), config.BANK_PAYMENT_TIMEOUT_MINTES),

				qrCodePaymentURL,
				requestAmount: Number(amount),
				requestMemo,

				data: null,
				thirdPartRequestId: null,
				thirdPartRequestData: null,
				thirdPartResponseData: null,
				thirdPartWebHookData: null,
				remark: null,
			});

			const newPaymentHistory = await PaymentHistoryService.getOneByCondition({
				id: createPaymentHistoryId,
			});
			if (!newPaymentHistory) {
				throw new CustomError({
					statusCode: 500,
					message: `paymentHistories not found id=${createPaymentHistoryId}`,
				});
			}

			const endAtNumber = differenceInSeconds(new Date(newPaymentHistory.endAt), new Date());

			const resp: AccountPaymentTransformer.createQrPayment.ResponseData = {
				requestId: newPaymentHistory.requestId,
				requestAmount: newPaymentHistory.requestAmount,
				requestMemo: newPaymentHistory.requestMemo,
				amount: newPaymentHistory.amount,
				status: newPaymentHistory.status,
				paymentAt: newPaymentHistory.txnAt ? format(newPaymentHistory.txnAt, 'yyyy-MM-dd HH:mm:ss zzz', { timeZone: 'Asia/Bangkok' }) : null,
				endAtNumber: endAtNumber < 1 ? 0 : endAtNumber,
				type: newPaymentHistory.type,
				qrCodePayment: {
					qrCodePaymentURL: newPaymentHistory.qrCodePaymentURL,
					bankPromptPayNo: reqUser.bankAccountActive.bankPromptPayNo,
					bankAccountNo: reqUser.bankAccountActive.bankAccountNoView,
					bankCode: 'SCB',
					bankName: 'ธนาคารไทยพาณิชย์',
					bankAccountNameEn: reqUser.bankAccountActive.bankAccountNameEn,
					bankAccountNameTh: reqUser.bankAccountActive.bankAccountNameTh,
				},
			};
			return reply.send(resp);
		} catch (error) {
			throw error;
		}
	};

	export const getQrPaymentByRequestId = async (request: AccountPaymentTransformer.getQrPayment.Request, reply: FastifyReply) => {
		try {
			const reqUser = AuthUserHook.getUserApi(request);

			const { requestId } = request.params;

			const paymentHistory = await PaymentHistoryService.getOneByCondition({
				requestId,
			});
			if (!paymentHistory) {
				throw new CustomError({
					statusCode: 422,
					message: `PAYMENT_NOT_FOUND`,
				});
			}

			const endAtNumber = differenceInSeconds(new Date(paymentHistory.endAt), new Date());

			const respData: AccountPaymentTransformer.getQrPayment.ResponseData = {
				requestId: paymentHistory.requestId,
				requestAmount: paymentHistory.requestAmount,
				requestMemo: paymentHistory.requestMemo,
				amount: paymentHistory.amount,
				status: paymentHistory.status,
				paymentAt: paymentHistory.txnAt ? format(paymentHistory.txnAt, 'yyyy-MM-dd HH:mm:ss zzz', { timeZone: 'Asia/Bangkok' }) : null,
				endAtNumber: endAtNumber < 1 ? 0 : endAtNumber,
				type: paymentHistory.type,
				qrCodePayment: {
					qrCodePaymentURL: paymentHistory.qrCodePaymentURL,
					bankPromptPayNo: reqUser.bankAccountActive.bankPromptPayNo,
					bankAccountNo: reqUser.bankAccountActive.bankAccountNoView,
					bankCode: 'SCB',
					bankName: 'ธนาคารไทยพาณิชย์',
					bankAccountNameEn: reqUser.bankAccountActive.bankAccountNameEn,
					bankAccountNameTh: reqUser.bankAccountActive.bankAccountNameTh,
				},
			};

			if (paymentHistory.status === PaymentStatusEnum.PENDING) {
				if (endAtNumber < 1) {
					await PaymentHistoryService.updateOneById(paymentHistory.id, {
						status: PaymentStatusEnum.TIMEOUT,
					});
					respData.status = PaymentStatusEnum.TIMEOUT;
				} else {
					// This code Validate transactions of qr-payment
					const startAt = paymentHistory.startAt;
					const endAt = paymentHistory.endAt;

					if (!paymentHistory.payee) {
						throw new CustomError({
							statusCode: 500,
							message: `payer must not be NULL`,
						});
					}

					const transactionsResponseData = await ScbApiService.getAccountTransactions(reqUser, {
						accountNo: paymentHistory.payee,
						startAt: format(startAt, 'yyyy-MM-dd', { timeZone: 'Asia/Bangkok' }),
						endAt: format(endAt, 'yyyy-MM-dd', { timeZone: 'Asia/Bangkok' }),
					});
					try {
						const findTransection = await ScbApiService.validateTransactionComplated(
							{
								paymentHistory,
								transactionsResponseData,
							},
						);
						if (findTransection) {
							await PaymentHistoryService.updateOneById(paymentHistory.id, {
								status: PaymentStatusEnum.SUCCESS,
								thirdPartResponseData: JSON.stringify(findTransection),
								txnAt: new Date(`${findTransection.txnDateTime}`),
								netAmount: `${findTransection.txnAmount}`,
								payer: `${findTransection?.txnRemark}`,
								remark: `txnDateTime: ${findTransection.txnDateTime}`,
							});
						}
					} catch (error) {
						if (error.message === 'ScbApi Error: resp status must be 1000') {
							await BankAppService.updateOneById(
								reqUser.id,
								{
									bankApiAuthExpire: previousDay(new Date(), 1),
								},
							);
						} else {
							throw error;
						}
					}
				}
			}

			return reply.send(respData);
		} catch (error) {
			throw error;
		}
	};

}
