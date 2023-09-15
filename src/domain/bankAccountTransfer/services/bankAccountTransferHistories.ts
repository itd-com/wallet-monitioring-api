import { BankAccountTransferHistory } from '../models/bankAccountTransferHistories';
import { BankAccountTransferHistoryRepo } from '../repositories/bankAccountTransferHistories';

export namespace BankAccountTransferHistoryService {
	export const getOneByCondition = async (where: Partial<BankAccountTransferHistory.T>): Promise<BankAccountTransferHistory.T | undefined> => {
		return BankAccountTransferHistoryRepo.queryOneByCondition(where);
	};
	export const getManyByCondition = async (where?: Partial<BankAccountTransferHistory.T>): Promise<BankAccountTransferHistory.T[]> => {
		return BankAccountTransferHistoryRepo.queryManyByCondition(where);
	};

	export const createOne = async (data: BankAccountTransferHistory.storeT): Promise<number> => {
		return BankAccountTransferHistoryRepo.insertOne(data);
	};

	export const updateOneById = async (id: number, data: BankAccountTransferHistory.updateT) => {
		return BankAccountTransferHistoryRepo.updateOneById(id, data);
	};

	export const deleteOneById = async (id: number) => {
		return BankAccountTransferHistoryRepo.deleteOneById(id);
	};
}
