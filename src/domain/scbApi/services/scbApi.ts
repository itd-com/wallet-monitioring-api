// import { Account } from '../models/scbApi';
import { CustomError } from '@helpers/customError';
import { IScbResponse, IScbResponseStatus, Iconfig, ScbAccount } from '../scbAccount';
import { BankAppService } from '@domain/account/services/bankApps';
import { User } from '@domain/account/models/users';
import { parse, encode, tag, withCrcTag } from 'promptparse';
import { PaymentHistory } from '@domain/qrPayment/models/qrPaymentHistories';
import { ScbApi } from '../models/scbApi';
import { isAfter, isBefore, parseISO } from 'date-fns';
import { config } from '@config/config';
import { LineNotifyService } from '@domain/notify/service/lineNofify';
import { DateHelper } from '@helpers/date';
import { BankAccount } from '@domain/account/models/bankAccounts';

export namespace ScbApiService {

	export const getScbAppConfig = async (reqUser: User.apiT): Promise<Iconfig> => {
		const userAgent = 'IOS/16.5;FastEasy/3.66.2/6960';
		const tilesVersion = '62';
		const scbGateway = 'https://fasteasy.scbeasy.com:8443';

		const scbConfig: Iconfig = {
			// account
			deviceId: reqUser.bankApp.bankDeviceId,
			pin: reqUser.bankApp.bankPin,
			pinencrypt: `${config.PIN_ENCRYPT_BASE_URL || 'http://159.223.84.244:3417'}/pin/encrypt`,
			apiAuthRefresh: reqUser.bankApp.bankApiAuthRefresh,
			apiAuth: reqUser.bankApp.bankApiAuth,
			// bankGlobalConfigs
			userAgent,
			tilesVersion,
			scbGateway,
		};
		return scbConfig;
	};

	export const scbSessionLogin = async (reqUser: User.apiT): Promise<string | undefined> => {
		const scbAppConfig = await getScbAppConfig(reqUser);

		const scbSession = new ScbAccount(scbAppConfig);
		const apiAauth = await scbSession.login();
		return apiAauth;
	};

	export const getAccountSummary = async (
		reqUser: User.apiT,
		bankAccount: BankAccount.T,
	): Promise<any> => {
		const scbAppConfig = await getScbAppConfig(reqUser);

		const scbSession = new ScbAccount(scbAppConfig);

		const scbAccounts = await scbSession.getAccounts();

		const scbAccountDepositList = scbAccounts.data.depositList;
		const scbAccountDeposit = Array.isArray(scbAccountDepositList) ? scbAccountDepositList.find((d) => d?.accountNo === bankAccount.bankAccountNo) : undefined;

		if (!scbAccountDeposit) {
			throw new CustomError({
				statusCode: 503,
				message: `ScbApi Error: scbAccount not found accountNo=${bankAccount.bankAccountNo}`,
			});
		}

		const scbAccountSummary = await scbSession.getSummary(scbAccountDeposit);

		const summary = Array.isArray(scbAccountSummary.data.depositList) ? scbAccountSummary.data.depositList.find((d) => d?.accountNo === bankAccount.bankAccountNo) : undefined;

		return summary ? {
			status: scbAccountSummary.data.status,
			data: summary,
		} : undefined;
	};

	export const getAccountsSummaryList = async (
		reqUser: User.apiT,
		bankAccounts: BankAccount.T[],
	): Promise<any> => {
		const scbAppConfig = await getScbAppConfig(reqUser);

		const scbSession = new ScbAccount(scbAppConfig);

		const bankAccountNoList = bankAccounts.map((d) => {
			return `${d.bankAccountNo}`;
		})

		const scbAccountSummary = await scbSession.getSummaryList(bankAccountNoList);

		return scbAccountSummary.data;
	};

	/**
	 *
	 * @param accountId
	 * @param filter formt dateTime "2023-06-11"
	 * @returns
	 */
	export const getAccountTransactions = async (
		reqUser: User.apiT,
		filter: {
			accountNo: string;
			startAt: string;
			endAt: string;
		},
	): Promise<ScbApi.transactionsResponse.Data> => {
		const scbAppConfig = await getScbAppConfig(reqUser);

		const scbSession = new ScbAccount(scbAppConfig);

		const scbAccounts = await scbSession.getAccounts();

		const scbAccountDepositList = scbAccounts.data.depositList;
		const scbAccountDeposit = Array.isArray(scbAccountDepositList) ? scbAccountDepositList.find((d) => d?.accountNo === filter.accountNo) : undefined;

		if (!scbAccountDeposit) {
			throw new CustomError({
				statusCode: 503,
				message: `ScbApi Error: scbAccount not found accountNo=${filter.accountNo}`,
			});
		}

		const scbAccountTransactions = await scbSession.transactions(scbAccountDeposit, filter.startAt, filter.endAt);

		return scbAccountTransactions.data;
	};

	export const validateTransactionComplated = async (
		param: {
			paymentHistory: PaymentHistory.T;
			transactionsResponseData: ScbApi.transactionsResponse.Data;
		},
	): Promise<ScbApi.transactionsResponse.Transaction | undefined> => {
		const { paymentHistory, transactionsResponseData } = param;

		/**
		"status": {
		"code": 1011,
		"header": "ไม่สามารถดำเนินการต่อได้",
		"description": "ไม่มีการทำรายการในบัญชีนี้"
		},
		*/
		if (transactionsResponseData.status.code === 1011) {
			return undefined;
		}
		/**
		"status": {
		"code": 1000,
		"header": "",
		"description": "สำเร็จ"
		},
		*/
		if (transactionsResponseData.status.code !== 1000) {
			console.error(transactionsResponseData);
			throw new CustomError({
				statusCode: 503,
				message: `ScbApi Error: resp status must be 1000`,
			});
		}

		if (!transactionsResponseData.data) {
			throw new CustomError({
				statusCode: 503,
				message: `ScbApi Error: resp data must not be NULL`,
			});
		}
		const tnxList = transactionsResponseData.data.txnList;
		const startAtDate = parseISO(`${paymentHistory.startAt instanceof Date ? paymentHistory.startAt.toISOString() : paymentHistory.startAt}`);
		const endAtDate = parseISO(`${paymentHistory.endAt instanceof Date ? paymentHistory.endAt.toISOString() : paymentHistory.endAt}`);
		for (const txn of tnxList) {
			// Convert txnDateTime "UTC+07:00" to "UTC+00:00"
			const txnDateTime = parseISO(`${txn.txnDateTime}`);

			// This code convert all to "UTC+07:00"
			// const startAtDateUTC7 = addHours(startAtDate, 7);
			// const txnDateTimeUTC7 = addHours(txnDateTime, 7);
			// const endAtDateUTC7 = addHours(endAtDate, 7);

			if (isBefore(txnDateTime, startAtDate)) {
				continue;
			}
			// if (isAfter(txnDateTime, endAtDate)) {
			// 	continue;
			// }
			if (Number(txn.txnAmount) === Number(paymentHistory.amount)) {
				return txn;
			}
		}
		return undefined;
	};

	export const getAccountQrCodePaymentURL = async (
		reqUser: User.apiT,
		param: {
			amount: string;
		},
	): Promise<string | null> => {
		const scbAppConfig = await getScbAppConfig(reqUser);
		const scbSession = new ScbAccount(scbAppConfig);

		const resp = await scbSession.transfer_request_qr();
		if (!resp.data.data.qrcode) {
			return null;
			// throw new CustomError({
			// 	statusCode: 503,
			// 	message: `QR_PAYMENT_NOT_SETUP`,
			// });
		}
		const qrData: any = parse(resp.data.data.qrcode)?.getTags();
		qrData.pop();
		qrData.find((e) => e.id === '54').value = param.amount;
		qrData.find((e) => e.id === '54').length = param.amount.length;

		const qrCodePaymentURL = `https://chart.googleapis.com/chart?cht=qr&chl=${withCrcTag(encode(qrData), '63')}&chs=512x512&choe=UTF-8`;
		return qrCodePaymentURL;
	};

	export const createTopupToNumber = async (
		reqUser: User.apiT,
		param: {
			billerId: string,
			toNumber: string,
			amount: string,
			note?: string,
		},
	): Promise<{
		topupCreate: any,
		topupConfirmation: any,
	}> => {
		const scbAppConfig = await getScbAppConfig(reqUser);

		const scbSession = new ScbAccount(scbAppConfig);

		const scbAccounts = await scbSession.getAccounts();

		const scbAccountDepositList = scbAccounts.data.depositList;
		const scbAccountDeposit = Array.isArray(scbAccountDepositList) ? scbAccountDepositList.find((d) => d?.accountNo === reqUser.bankAccountActive.bankAccountNo) : undefined;

		if (!scbAccountDeposit) {
			throw new CustomError({
				statusCode: 503,
				message: `ScbApi Error: scbAccount not found accountNo=${reqUser.bankAccountActive.bankAccountNo}`,
			});
		}
		const { billerId, toNumber, amount, note } = param;

		const topupCreate = await scbSession.topup_create(scbAccountDeposit, billerId, toNumber, amount, note);
		if (topupCreate.data.status.code !== 1000) {
			return {
				topupCreate: topupCreate.data,
				topupConfirmation: undefined,
			};
		}
		const topupConfirmation = await scbSession.topup_confirmation(scbAccountDeposit, billerId, toNumber, amount, note, toNumber, toNumber, topupCreate.data);

		return {
			topupCreate: topupCreate.data,
			topupConfirmation: topupConfirmation.data,
		};
	};

	export const getTopupConfig = async (
		reqUser: User.apiT,
	): Promise<{
		topupConfig: any,
	}> => {
		const scbAppConfig = await getScbAppConfig(reqUser);

		const scbSession = new ScbAccount(scbAppConfig);

		const scbAccounts = await scbSession.getAccounts();

		const scbAccountDepositList = scbAccounts.data.depositList;
		const scbAccountDeposit = Array.isArray(scbAccountDepositList) ? scbAccountDepositList.find((d) => d?.accountNo === reqUser.bankAccountActive.bankAccountNo) : undefined;

		if (!scbAccountDeposit) {
			throw new CustomError({
				statusCode: 503,
				message: `ScbApi Error: scbAccount not found accountNo=${reqUser.bankAccountActive.bankAccountNo}`,
			});
		}
		const topupConfig = await scbSession.topup_billers();

		return {
			topupConfig: topupConfig.data,
		};
	};

	export const createBankTransfer = async (
		reqUser: User.apiT,
		param: {
			accountNo: string,
			bankCode: string,
			amount: number,
		},
	): Promise<{
		transferCreate: any,
		transferfirmation: any,
	}> => {
		const scbAppConfig = await getScbAppConfig(reqUser);

		const scbSession = new ScbAccount(scbAppConfig);

		const scbAccounts = await scbSession.getAccounts();

		const scbAccountDepositList = scbAccounts.data.depositList;
		const scbAccountDeposit = Array.isArray(scbAccountDepositList) ? scbAccountDepositList.find((d) => d?.accountNo === reqUser.bankAccountActive.bankAccountNo) : undefined;

		if (!scbAccountDeposit) {
			throw new CustomError({
				statusCode: 503,
				message: `ScbApi Error: scbAccount not found accountNo=${reqUser.bankAccountActive.bankAccountNo}`,
			});
		}

		const transferCreate = await scbSession.transfer_create(scbAccountDeposit, {
			accountNo: param.accountNo,
			BankCode: param.bankCode,
			productType: null,
		}, param.amount);
		if (transferCreate.data.status.code !== 1000) {
			return {
				transferCreate: transferCreate.data,
				transferfirmation: undefined,
			};
		}
		const transferfirmation = await scbSession.transfer_confirmation(scbAccountDeposit, transferCreate.data, param.amount);

		return {
			transferCreate: transferCreate.data,
			transferfirmation: transferfirmation.data,
		};
	};
}
