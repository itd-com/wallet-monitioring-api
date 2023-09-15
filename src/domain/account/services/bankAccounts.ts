import { CustomError } from '@helpers/customError';
import { BankAccount } from '../models/bankAccounts';
import { BankAccountRepo } from '../repositories/bankAccounts';
import { Utils } from '@helpers/utils';
import { TopupHistoryService } from '@domain/topup/services/topupHistories';
import { config } from '@config/config';
import { User } from '../models/users';

export namespace BankAccountService {
	export const getOneByCondition = async (where: Partial<BankAccount.T>): Promise<BankAccount.T | undefined> => {
		return BankAccountRepo.queryOneByCondition(where);
	};

	export const getManyByCondition = async (where?: Partial<BankAccount.T>): Promise<BankAccount.T[]> => {
		return BankAccountRepo.queryManyByCondition(where);
	};

	export const getManyByConditionAndOrderBy = async (
		where: Partial<BankAccount.T>,
		order: {
			column: string,
			by: 'asc' | 'desc',
		},
	): Promise<BankAccount.T[]> => {
		return BankAccountRepo.queryManyByConditionAndOrderBy(where, order);
	};

	export const createOne = async (data: BankAccount.storeT): Promise<number> => {
		return BankAccountRepo.insertOne(data);
	};

	export const updateOneById = async (id: number, data: BankAccount.updateT) => {
		return BankAccountRepo.updateOneById(id, data);
	};

	export const updateOneByCondition = async (where: Partial<BankAccount.T>, data: BankAccount.updateT) => {
		return BankAccountRepo.updateOneByCondition(where, data);
	};

	export const updatePushNumberById = async (
		id: number,
		value: {
			column: string,
			push: number,
		},
	) => {
		return BankAccountRepo.updatePushNumberById(id, value);
	};

	export const updateDownNumberById = async (
		id: number,
		value: {
			column: string,
			down: number,
		},
	) => {
		return BankAccountRepo.updateDownNumberById(id, value);
	};

	export const deleteOneById = async (id: number) => {
		return BankAccountRepo.deleteOneById(id);
	};

	export const updateTodayTopUpTruemoneyBalanceById = async (id: number, amount: number) => {
		return BankAccountRepo.updateTodayTopUpTruemoneyBalanceById(id, amount);
	};

	export const getOneForEnableServiceQrPayment = async (bankAccounts: BankAccount.T[]): Promise<BankAccount.T> => {
		const bankAccountEnableServiceList = bankAccounts.filter((f) => f.enableServiceQrPayment);

		const bankAccount = Utils.randomValueArray(bankAccountEnableServiceList);
		if (!bankAccount) {
			throw new CustomError({
				statusCode: 503,
				message: 'bankAccounts not found by enableServiceQrPayment',
			});
		}

		return bankAccount;
	};

	export const getOneForEnableServiceTopup = async (amount, userApi: User.apiT): Promise<BankAccount.T> => {
		const bankAccountTopupLimitPerDay = config.BANK_ACCOUNT_TOPUP_LIMIT_PER_DAY;
		const switchBankAccountBalanceMinimum = config.SWITCH_BANK_ACCOUNT_BALANCE_MINIMUM;

		for (const ba of userApi.bankAccounts) {
			if (ba.enableServiceTopup) {

				if ((Number(ba.todayTopUpTruemoneyBalance) + Number(amount)) <= Number(bankAccountTopupLimitPerDay)) {

					if (Number(ba.bankAccountBalance) > Number(switchBankAccountBalanceMinimum)) {

						return ba;
					}
				}
			}
		}

		const bankAccountsDesc = await BankAccountService.getManyByConditionAndOrderBy(
			{
				bankAppId: userApi.bankApp.id,
			},
			{
				column: 'bankAccountBalance',
				by: 'desc',
			}
		);

		for (const ba of bankAccountsDesc) {
			if (ba.enableServiceTopup) {

				if ((Number(ba.todayTopUpTruemoneyBalance) + Number(amount)) <= Number(bankAccountTopupLimitPerDay)) {
					return ba;
				}
			}
		}

		throw new CustomError({
			statusCode: 503,
			message: 'LIMITED_BANK_APP_TOPUP',
		});

	};

	export const getOneForEnableServiceBankTransfer = async (bankAccounts: BankAccount.T[]): Promise<BankAccount.T> => {
		const bankAccountEnableServiceList = bankAccounts.filter((f) => f.enableServiceBankTransfer);

		const bankAccount = Utils.randomValueArray(bankAccountEnableServiceList);
		if (!bankAccount) {
			throw new CustomError({
				statusCode: 503,
				message: 'bankAccounts not found by enableServiceBankTransfer',
			});
		}

		return bankAccount;
	};


}
