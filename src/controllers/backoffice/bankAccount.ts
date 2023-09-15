/* eslint-disable no-useless-catch */
import { CustomError } from '@helpers/customError';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthUserHook } from '@hooks/authUser';
import { BackOfficeBankAccountTransformer } from '@transformer/backoffice/bankAccount';
import { UserRoleEnum } from '@enums/userEnum';
import { BankAccountService } from '@domain/account/services/bankAccounts';

export namespace BackOfficeBankAccountController {
	export const createBankAccount = async (request: BackOfficeBankAccountTransformer.createBankAccount.Request, reply: FastifyReply) => {
		try {
			const reqUser = AuthUserHook.getUserApi(request);
			if ([UserRoleEnum.CUSTOMER_READ_ONLY, UserRoleEnum.ADMIN_READ_ONLY].includes(reqUser.role)) {
				throw new CustomError({
					statusCode: 422,
					message: `Invalid role.`,
				})
			}

			const {
				name,
				serviceName,
				bankAppId,

				bankAccountBalance,
				todayTopUpTruemoneyBalance,

				enableServiceQrPayment,
				enableServiceTopup,
				enableServiceBankTransfer,

				bankAccountNo,
				bankAccountNoView,
				bankPromptPayNo,
				bankAccountNameTh,
				bankAccountNameEn,
				bankBranchName,
			} = request.body;

			var createBankAccountId = await BankAccountService.createOne({
				name,
				serviceName,
				bankAppId,

				bankAccountBalance,
				todayTopUpTruemoneyBalance,

				enableServiceQrPayment,
				enableServiceTopup,
				enableServiceBankTransfer,

				bankAccountNo,
				bankAccountNoView,
				bankPromptPayNo,
				bankAccountNameTh,
				bankAccountNameEn,
				bankBranchName,
			});

			var bankAccount = await BankAccountService.getOneByCondition({
				id: createBankAccountId,
			});
			if (!bankAccount) {
				throw new CustomError({
					statusCode: 404,
					message: `users not found by id=${createBankAccountId}`,
				})
			}

			var resp: BackOfficeBankAccountTransformer.createBankAccount.ResponseData = bankAccount;
			return reply.send(resp);



		} catch (error) {
			throw error;
		}
	};

	export const getBankAccounts = async (request: BackOfficeBankAccountTransformer.getBankAccounts.Request, reply: FastifyReply) => {
		try {
			const reqUser = AuthUserHook.getUserApi(request);

			switch (reqUser.role) {
				case UserRoleEnum.MY_APP:
				case UserRoleEnum.CUSTOMER:
				case UserRoleEnum.CUSTOMER_READ_ONLY:
					var bankAccounts = await BankAccountService.getManyByCondition({
						serviceName: reqUser.serviceName,
					});

					var resp: BackOfficeBankAccountTransformer.getBankAccounts.ResponseData = bankAccounts;
					return reply.send(resp);

				case UserRoleEnum.ADMIN:
				case UserRoleEnum.ADMIN_READ_ONLY:
				case UserRoleEnum.SUPER_ADMIN:
					var bankAccounts = await BankAccountService.getManyByCondition();

					var resp: BackOfficeBankAccountTransformer.getBankAccounts.ResponseData = bankAccounts;
					return reply.send(resp);

				default:
					break;
			}

			throw new CustomError({
				statusCode: 500,
				message: `Invalid role permission getUsers.`,
			})
		} catch (error) {
			throw error;
		}
	};

	export const getBankAccountById = async (request: BackOfficeBankAccountTransformer.getBankAccountById.Request, reply: FastifyReply) => {
		try {
			const {
				bankAccountId,
			} = request.params;

			const reqUser = AuthUserHook.getUserApi(request);

			switch (reqUser.role) {
				case UserRoleEnum.MY_APP:
				case UserRoleEnum.CUSTOMER:
				case UserRoleEnum.CUSTOMER_READ_ONLY:
					var bankAccount = await BankAccountService.getOneByCondition({
						id: bankAccountId,
						serviceName: reqUser.serviceName,
					});
					if (!bankAccount) {
						throw new CustomError({
							statusCode: 404,
							message: `bankAccounts not found by id=${bankAccountId}`,
						})
					}

					var resp: BackOfficeBankAccountTransformer.getBankAccountById.ResponseData = bankAccount;
					return reply.send(resp);

				case UserRoleEnum.ADMIN:
				case UserRoleEnum.ADMIN_READ_ONLY:
				case UserRoleEnum.SUPER_ADMIN:
					var bankAccount = await BankAccountService.getOneByCondition({
						id: bankAccountId,
					});
					if (!bankAccount) {
						throw new CustomError({
							statusCode: 404,
							message: `bankAccounts not found by id=${bankAccountId}`,
						})
					}

					var resp: BackOfficeBankAccountTransformer.getBankAccountById.ResponseData = bankAccount;
					return reply.send(resp);

				default:
					break;
			}

			throw new CustomError({
				statusCode: 500,
				message: `Invalid role permission getUsers.`,
			})
		} catch (error) {
			throw error;
		}
	};

	export const updateBankAccountById = async (request: BackOfficeBankAccountTransformer.updateBankAccountById.Request, reply: FastifyReply) => {
		try {
			const reqUser = AuthUserHook.getUserApi(request);
			if (![UserRoleEnum.CUSTOMER_READ_ONLY, UserRoleEnum.ADMIN_READ_ONLY].includes(reqUser.role)) {
				throw new CustomError({
					statusCode: 422,
					message: `Invalid role.`,
				})
			}

			const {
				bankAccountId,
			} = request.params;

			const {
				name,
				serviceName,
				bankAppId,

				bankAccountBalance,
				todayTopUpTruemoneyBalance,

				enableServiceQrPayment,
				enableServiceTopup,
				enableServiceBankTransfer,

				bankAccountNo,
				bankAccountNoView,
				bankPromptPayNo,
				bankAccountNameTh,
				bankAccountNameEn,
				bankBranchName,
			} = request.body;

			var createBankAccountId = await BankAccountService.updateOneById(bankAccountId, {
				name,
				serviceName,
				bankAppId,

				bankAccountBalance,
				todayTopUpTruemoneyBalance,

				enableServiceQrPayment,
				enableServiceTopup,
				enableServiceBankTransfer,

				bankAccountNo,
				bankAccountNoView,
				bankPromptPayNo,
				bankAccountNameTh,
				bankAccountNameEn,
				bankBranchName,
			});

			var bankAccount = await BankAccountService.getOneByCondition({
				id: createBankAccountId,
			});
			if (!bankAccount) {
				throw new CustomError({
					statusCode: 404,
					message: `users not found by id=${createBankAccountId}`,
				})
			}

			var resp: BackOfficeBankAccountTransformer.updateBankAccountById.ResponseData = bankAccount;
			return reply.send(resp);

		} catch (error) {
			throw error;
		}
	};

}
