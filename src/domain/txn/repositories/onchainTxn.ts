import { CustomError } from '@helpers/customError';
import { Db } from '../../db';
import { OnchainTxn } from '../models/onchainTxn';

export namespace OnchainTxnRepo {
	const onchainTxnTable = OnchainTxn.TableName;

	export const queryOneByCondition = async (where: Partial<OnchainTxn.T>): Promise<OnchainTxn.T | undefined> => {
		return Db.conn(onchainTxnTable).select().where({ ...where }).first();
	};

	export const queryManyByCondition = async (where?: Partial<OnchainTxn.T>): Promise<OnchainTxn.T[]> => {
		if (where) {
			return Db.conn(onchainTxnTable)
				.select()
				.where({ ...where })
				.orderBy('createdAt', 'desc');

		}
		return Db.conn(onchainTxnTable).select();
	};

	export const insertOne = async (data: OnchainTxn.storeT): Promise<number> => {
		try {
			const id = await Db.conn(onchainTxnTable)
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

}
