import { FeeSysHistory } from '../models/feeSysHistories';
import { FeeSysHistoryRepo } from '../repositories/feeSysHistories';

export namespace FeeSysHistoryService {
	export const getOneByCondition = async (where: Partial<FeeSysHistory.T>): Promise<FeeSysHistory.T | undefined> => {
		return FeeSysHistoryRepo.queryOneByCondition(where);
	};
	export const getManyByCondition = async (where?: Partial<FeeSysHistory.T>): Promise<FeeSysHistory.T[]> => {
		return FeeSysHistoryRepo.queryManyByCondition(where);
	};

	export const createOne = async (data: FeeSysHistory.storeT): Promise<number> => {
		return FeeSysHistoryRepo.insertOne(data);
	};

	export const updateOneById = async (id: number, data: FeeSysHistory.updateT) => {
		return FeeSysHistoryRepo.updateOneById(id, data);
	};

	export const deleteOneById = async (id: number) => {
		return FeeSysHistoryRepo.deleteOneById(id);
	};
}
