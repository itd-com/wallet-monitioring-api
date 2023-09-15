import { FastifyRequest } from 'fastify';
import { addDays, isPast, addMinutes } from 'date-fns';
import { CustomError } from '@helpers/customError';
import { InternalServalError } from '../errors/database';
import { BankAppService } from '@domain/account/services/bankApps';
import { config } from '@config/config';
import { ScbApiService } from '@domain/scbApi/services/scbApi';
import { OpensslHelper } from '@helpers/openssl';
import { AuthUserHook } from './authUser';
import { User } from '@domain/account/models/users';
import { BankAccountService } from '@domain/account/services/bankAccounts';
import { PaymentHistoryService } from '@domain/qrPayment/services/qrPaymentHistories';
import { DateHelper } from '@helpers/date';
import { LineNotifyService } from '@domain/notify/service/lineNofify';
import { TopupTypeEnum } from '@enums/topupEnum';
import { TopupHistoryService } from '@domain/topup/services/topupHistories';

export namespace AuthBankAppHook {
	export const login = async (request: FastifyRequest): Promise<void> => {
		const userApi = AuthUserHook.getUserApi(request);
		const isTokenExpired = isPast(new Date(userApi.bankApp.bankApiAuthExpire));
		if (isTokenExpired) {
			const newApiAuth = await ScbApiService.scbSessionLogin(userApi);
			if (!newApiAuth) {
				const nowThai = DateHelper.getNowThai();

				const notifyMessages = [
					`📢❗️❗️❗️ ไม่สามารถเข้าสู่ระบบได้: กรุณาติดต่อผู้ดูแลระบบ\n`,
					`\n`,
					`บริการ:แอปพลิเคชัน \n`,
					`\n`,
					` บริการ: ${userApi.bankApp.serviceName.toLocaleLowerCase()}\n`,
					` SCB บัญชี: ${userApi.bankAccountActive.bankAccountNoView}\n`,
					userApi.bankAccountActive?.bankBranchName ? ` SCB สาขา: ${userApi.bankAccountActive.bankBranchName}\n` : '',
					` SCB ชื่อบัญชี: ${userApi.bankAccountActive.bankAccountNameTh}\n`,
					`\n`,
					`🗓 ${nowThai}`,
				];
				await LineNotifyService.sendNotify(
					userApi,
					`${notifyMessages.join('')}`,
				);
				throw new CustomError({
					statusCode: 503,
					message: 'ScbApi Error: Unable to login',
				});
			}

			console.log(`OLD LOGIN SESSTION : ${userApi.bankApp.bankApiAuth}`);
			console.log(`      NEW API AUTH : ${newApiAuth}`);

			await BankAppService.updateOneById(
				userApi.bankApp.id,
				{
					bankApiAuthEcd: OpensslHelper.publicEncrypt(newApiAuth),
					bankApiAuthExpire: addMinutes(new Date(), config.BANK_API_AUTH_EXPIRE_MINTES),
				},
			);

			const bankAppDcd = await BankAppService.getOneDecryptedById(userApi.bankApp.id);

			const newUserApi: User.apiT = {
				...userApi,
				bankApp: bankAppDcd,
			};

			Object.assign(request, {
				userApi: newUserApi,
			});
			console.log(`NEW LOGIN SESSTION : ${userApi.bankApp.bankApiAuth}`);
		}

		return Promise.resolve();
	};

	export const setBankAccountActiveForCreateRequsetServiceQrPayment = async (
		request: FastifyRequest<{}>,
	): Promise<void> => {

		const userApi = AuthUserHook.getUserApi(request);
		const bankAccountActive = await BankAccountService.getOneForEnableServiceQrPayment(userApi.bankAccounts);

		const newUserApi: User.apiT = {
			...userApi,
			bankAccountActive,
		};

		Object.assign(request, {
			userApi: newUserApi,
		});

		return Promise.resolve();
	};

	export const setBankAccountActiveForGetRequsetServiceQrPayment = async (
		request: FastifyRequest<{
			Params: {
				requestId?: string;
			}
		}>,
	): Promise<void> => {

		const userApi = AuthUserHook.getUserApi(request);

		const { requestId } = request.params;
		if (!requestId) {
			throw new CustomError({
				statusCode: 422,
				message: `requestId must not be NULL`,
			});
		}

		const paymentHistory = await PaymentHistoryService.getOneByCondition({
			requestId,
		});
		if (!paymentHistory) {
			throw new CustomError({
				statusCode: 422,
				message: `PAYMENT_NOT_FOUND`,
			});
		}

		if (!paymentHistory.payee) {
			throw new CustomError({
				statusCode: 500,
				message: `payer must not be NULL`,
			});
		}

		const bankAccountActive = await BankAccountService.getOneByCondition({
			enableServiceQrPayment: true,
			bankAccountNo: paymentHistory.payee,
		});

		if (!bankAccountActive) {
			throw new CustomError({
				statusCode: 500,
				message: `bankAccounts not found by enableServiceQrPayment, bankAccountNo=${paymentHistory.payee}`,
			});
		}

		const newUserApi: User.apiT = {
			...userApi,
			bankAccountActive,
		};

		Object.assign(request, {
			userApi: newUserApi,
		});

		return Promise.resolve();
	};

	export const setBankAccountActiveForCreateRequsetServiceTopup = async (
		request: FastifyRequest<{
			Body: {
				fromBankAccountNo?: string;
				type: TopupTypeEnum;
				toNumber: string;
				amount: string;
				note?: string;
			}
		}>,
	): Promise<void> => {
		const userApi = AuthUserHook.getUserApi(request);
		const {
			fromBankAccountNo,
			type,
			toNumber,
			amount,
		} = request.body;
		if (!fromBankAccountNo) {


			if (![
				TopupTypeEnum.TRUEMONEY,
				TopupTypeEnum.E_WALLET,
			].includes(type)) {
				throw new CustomError({
					statusCode: 422,
					message: 'TYPE_NOT_SUPPORT',
				});
			}

			if (isNaN(Number(amount))) {
				throw new CustomError({
					statusCode: 422,
					message: 'INVALID_AMOUNT',
				});
			}

			if (type === TopupTypeEnum.TRUEMONEY && toNumber.length !== 10) {
				throw new CustomError({
					statusCode: 422,
					message: 'INVALID_TRUEMONEY_NUMBER_FORMAT',
				});
			}

			const isEWallet = type === TopupTypeEnum.E_WALLET;
			if (!isEWallet && Number(amount) < 100) {
				throw new CustomError({
					statusCode: 422,
					message: 'INVALID_AMOUNT',
				});
			}

			if (isEWallet && (toNumber.slice(0, 5) !== '14000' || toNumber.length !== 15)) {
				throw new CustomError({
					statusCode: 422,
					message: 'INVALID_E_WALLET_NUMBER_FORMAT',
				});
			}

			const bankAccountActive = await BankAccountService.getOneForEnableServiceTopup(
				Number(amount),
				userApi,
			);

			await TopupHistoryService.validateTopupToNumberLimitIn24Hours(
				{
					toNumber,
					type,
					amount: Number(amount),
				},
			);

			const newUserApi: User.apiT = {
				...userApi,
				bankAccountActive,
			};

			Object.assign(request, {
				userApi: newUserApi,
			});

			return Promise.resolve();

		} else {

			const bankAccountActive = await BankAccountService.getOneByCondition({
				enableServiceTopup: true,
				bankAccountNo: fromBankAccountNo,
			})
			if (!bankAccountActive) {
				throw new CustomError({
					statusCode: 500,
					message: `bankAccounts not found by enableServiceTopup, bankAccountNo=${fromBankAccountNo}`,
				});
			}

			const newUserApi: User.apiT = {
				...userApi,
				bankAccountActive,
			};

			Object.assign(request, {
				userApi: newUserApi,
			});

			return Promise.resolve();
		}

	};

	export const setBankAccountActiveForCreateRequsetServiceBankTransfer = async (
		request: FastifyRequest<{
			Body: {
				fromBankAccountNo?: string;
			}
		}>,
	): Promise<void> => {
		const userApi = AuthUserHook.getUserApi(request);
		const { fromBankAccountNo } = request.body;
		if (!fromBankAccountNo) {

			const bankAccountActive = await BankAccountService.getOneForEnableServiceBankTransfer(userApi.bankAccounts);

			const newUserApi: User.apiT = {
				...userApi,
				bankAccountActive,
			};

			Object.assign(request, {
				userApi: newUserApi,
			});

			return Promise.resolve();

		} else {

			const bankAccountActive = await BankAccountService.getOneByCondition({
				enableServiceBankTransfer: true,
				bankAccountNo: fromBankAccountNo,
			})
			if (!bankAccountActive) {
				throw new CustomError({
					statusCode: 500,
					message: `bankAccounts not found by enableServiceBankTransfer, bankAccountNo=${fromBankAccountNo}`,
				});
			}

			const newUserApi: User.apiT = {
				...userApi,
				bankAccountActive,
			};

			Object.assign(request, {
				userApi: newUserApi,
			});

			return Promise.resolve();
		}


	};
}
