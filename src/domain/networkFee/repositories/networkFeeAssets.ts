import { CustomError } from '@helpers/customError';
import { Db } from '../../db';
import { NetworkFeeAsset } from '../models/networkFeeAssets';

export namespace NetworkFeeAssetRepo {
	const networkFeeAssetsTable = NetworkFeeAsset.TableName;

	export const queryOneByCondition = async (where: Partial<NetworkFeeAsset.T>): Promise<NetworkFeeAsset.T | undefined> => {
		return Db.conn(networkFeeAssetsTable).select().where({ ...where }).first();
	};

	export const queryManyByCondition = async (where?: Partial<NetworkFeeAsset.T>): Promise<NetworkFeeAsset.T[]> => {
		if (where) {
			return Db.conn(networkFeeAssetsTable)
				.select()
				.where({ ...where });
		}
		return Db.conn(networkFeeAssetsTable).select();
	};

	export const insertOne = async (data: NetworkFeeAsset.storeT): Promise<number> => {
		try {
			const id = await Db.conn(networkFeeAssetsTable)
				.insert(data)
				.then((rows) => {
					return rows[0];
				});

			return id;
		} catch (error) {
			if (error.code === 'ER_DUP_ENTRY') {
				throw new CustomError({
					statusCode: 422,
					message: error.code,
				});
			}
			throw new CustomError({
				statusCode: 500,
				message: error.message,
			});
		}
	};

	export const queryManyByFilter = async (
		filters: {
			currency?: string;
			sortBy?: string;
			dateFrom?: string;
			dateTo?: string;
		},
	): Promise<NetworkFeeAsset.T[]> => {
		const masterQuery = Db.conn(networkFeeAssetsTable).clone();

		const {
			currency,
			sortBy,
			dateFrom,
			dateTo,
		} = filters;

		if (currency) {
			masterQuery.andWhere((queryBuilder) => {
				queryBuilder.andWhereRaw('currency = ?', [`${currency}`]);
			});
		}

		if (sortBy && ['ASC', 'DESC'].includes(sortBy)) {
			masterQuery.orderByRaw('createdAt', sortBy);
		}

		if (dateFrom) {
			masterQuery.andWhere((queryBuilder) => {
				queryBuilder.andWhereRaw('DATE(CONVERT_TZ(createdAt, \'+00:00\', \'+07:00\')) >= ?', [`${dateFrom}`]);
			});
		}

		if (dateTo) {
			masterQuery.andWhere((queryBuilder) => {
				queryBuilder.andWhereRaw('DATE(CONVERT_TZ(createdAt, \'+00:00\', \'+07:00\')) <= ?', [`${dateTo}`]);
			});
		}

		return masterQuery.select();
	};

}
