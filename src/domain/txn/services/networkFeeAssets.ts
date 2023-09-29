import { OnchainTxn } from '../models/onchainTxn';
import { OnchainTxnRepo } from '../repositories/onchainTxn';

export namespace OnchainTxnService {
	export const getOneByCondition = async (where: Partial<OnchainTxn.T>): Promise<OnchainTxn.T | undefined> => {
		return OnchainTxnRepo.queryOneByCondition(where);
	};

	export const getManyByCondition = async (where?: Partial<OnchainTxn.T>): Promise<OnchainTxn.T[]> => {
		return OnchainTxnRepo.queryManyByCondition(where);
	};

	export const createOne = async (data: OnchainTxn.storeT): Promise<number> => {
		return OnchainTxnRepo.insertOne(data);
	};
}
