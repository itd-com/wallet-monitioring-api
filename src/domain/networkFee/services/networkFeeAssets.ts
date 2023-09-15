import { NetworkFeeAsset } from '../models/networkFeeAssets';
import { NetworkFeeAssetRepo } from '../repositories/networkFeeAssets';

export namespace NetworkFeeAssetService {
	export const getOneByCondition = async (where: Partial<NetworkFeeAsset.T>): Promise<NetworkFeeAsset.T | undefined> => {
		return NetworkFeeAssetRepo.queryOneByCondition(where);
	};

	export const getManyByCondition = async (where?: Partial<NetworkFeeAsset.T>): Promise<NetworkFeeAsset.T[]> => {
		return NetworkFeeAssetRepo.queryManyByCondition(where);
	};

	export const createOne = async (data: NetworkFeeAsset.storeT): Promise<number> => {
		return NetworkFeeAssetRepo.insertOne(data);
	};

	export const getManyByFilter = async (filters: {
		currency?: string;
		sortBy?: string;
		dateFrom?: string;
		dateTo?: string;
	},): Promise<NetworkFeeAsset.T[]> => {
		return NetworkFeeAssetRepo.queryManyByFilter(filters);
	};
}
