import { CustomError } from '@helpers/customError';
import { Db } from '../../db';
import { FeeSysHistory } from '../models/feeSysHistories';
import { DuplicateEntry } from '../../../errors/database';

export namespace FeeSysHistoryRepo {
	const feeSysHistoriesTable = FeeSysHistory.TableName;

	export const queryOneByCondition = async (where: Partial<FeeSysHistory.T>): Promise<FeeSysHistory.T | undefined> => {
		return Db.conn(feeSysHistoriesTable).select().where({ ...where }).first();
	};

	export const queryManyByCondition = async (where?: Partial<FeeSysHistory.T>): Promise<FeeSysHistory.T[]> => {
		if (where) {
			return Db.conn(feeSysHistoriesTable)
				.select()
				.where({ ...where });
		}
		return Db.conn(feeSysHistoriesTable).select();
	};

	export const insertOne = async (data: FeeSysHistory.storeT): Promise<number> => {
		try {
			const id = await Db.conn(feeSysHistoriesTable)
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

	export const updateOneById = async (id: number, data: FeeSysHistory.updateT) => {
		return Db.conn(feeSysHistoriesTable).where({ id }).update(data);
	};

	export const deleteOneById = async (id: number) => {
		return Db.conn(feeSysHistoriesTable).where({ id }).delete();
	};
}
