import { CustomError } from '@helpers/customError';
import { BankApp } from '../models/bankApps';
import { BankAppRepo } from '../repositories/bankApps';
import { OpensslHelper } from '@helpers/openssl';
import { AuthorizationTokenInvalid, AuthorizationTokenNotFound } from '../../../errors/auth';

export namespace BankAppService {
	export const getOneByCondition = async (where: Partial<BankApp.T>): Promise<BankApp.T | undefined> => {
		return BankAppRepo.queryOneByCondition(where);
	};
	export const getManyByCondition = async (where?: Partial<BankApp.T>): Promise<BankApp.T[]> => {
		return BankAppRepo.queryManyByCondition(where);
	};

	export const createOne = async (data: BankApp.storeT): Promise<number> => {
		return BankAppRepo.insertOne(data);
	};

	export const updateOneById = async (id: number, data: BankApp.updateT) => {
		return BankAppRepo.updateOneById(id, data);
	};

	export const updateOneByCondition = async (where: Partial<BankApp.T>, data: BankApp.updateT) => {
		return BankAppRepo.updateOneByCondition(where, data);
	};

	export const deleteOneById = async (id: number) => {
		return BankAppRepo.deleteOneById(id);
	};

	export const getDecryptedData = async (bankApp: BankApp.T): Promise<BankApp.Decrypted> => {
		try {
			const bankDeviceId = OpensslHelper.privateDecrypt(bankApp.bankDeviceIdEcd);
			const bankPin = OpensslHelper.privateDecrypt(bankApp.bankPinEcd);
			const bankApiAuthRefresh = OpensslHelper.privateDecrypt(bankApp.bankApiAuthRefreshEcd);
			const bankApiAuth = OpensslHelper.privateDecrypt(bankApp.bankApiAuthEcd);

			return {
				id: bankApp.id,
				name: bankApp.name,
				serviceName: bankApp.serviceName,

				feePaymentRate: bankApp.feePaymentRate,
				feeTopupRate: bankApp.feeTopupRate,
				feeBankTransferRate: bankApp.feeBankTransferRate,

				notifyToken1: bankApp.notifyToken1,
				notifyToken2: bankApp.notifyToken2,

				enableServiceQrPayment: bankApp.enableServiceQrPayment,
				enableServiceTopup: bankApp.enableServiceTopup,
				enableServiceBankTransfer: bankApp.enableServiceBankTransfer,

				bankDeviceId,
				bankPin,
				bankApiAuthRefresh,
				bankApiAuth,
				bankApiAuthExpire: bankApp.bankApiAuthExpire,

				createdAt: bankApp.createdAt,
				updatedAt: bankApp.updatedAt,
			};
		} catch (error) {
			if (error.code === 'ERR_OSSL_RSA_OAEP_DECODING_ERROR') {
				throw new CustomError(AuthorizationTokenInvalid);
			}
			throw error;
		}
	};

	export const getOneDecryptedById = async (id: number): Promise<BankApp.Decrypted> => {
		try {
			const account = await BankAppRepo.queryOneByCondition({
				id,
			});
			if (!account) {
				throw new CustomError({
					statusCode: 404,
					message: `account not found by${JSON.stringify({ id })}`,
				});
			}

			const accountDcd = await getDecryptedData(account);

			return accountDcd;
		} catch (error) {
			if (error.code === 'ERR_OSSL_RSA_OAEP_DECODING_ERROR') {
				throw new CustomError(AuthorizationTokenInvalid);
			}
			throw error;
		}
	};

	export const getOneDecryptedByCondition = async (where: Partial<BankApp.T>): Promise<BankApp.Decrypted> => {
		try {
			const account = await BankAppRepo.queryOneByCondition(where);
			if (!account) {
				throw new CustomError({
					statusCode: 404,
					message: `account not found by${JSON.stringify(where)}`,
				});
			}

			const accountDcd = await getDecryptedData(account);

			return accountDcd;
		} catch (error) {
			if (error.code === 'ERR_OSSL_RSA_OAEP_DECODING_ERROR') {
				throw new CustomError(AuthorizationTokenInvalid);
			}
			throw error;
		}
	};
}
