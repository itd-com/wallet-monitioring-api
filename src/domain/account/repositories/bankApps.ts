import { CustomError } from '@helpers/customError';
import { Db } from '../../db';
import { BankApp } from '../models/bankApps';

export namespace BankAppRepo {
	const bankAppTable = BankApp.TableName;

	export const queryOneByCondition = async (where: Partial<BankApp.T>): Promise<BankApp.T | undefined> => {
		return Db.conn(bankAppTable).select().where({ ...where }).first();
	};

	export const queryManyByCondition = async (where?: Partial<BankApp.T>): Promise<BankApp.T[]> => {
		if (where) {
			return Db.conn(bankAppTable)
				.select()
				.where({ ...where });
		}
		return Db.conn(bankAppTable).select();
	};

	export const insertOne = async (data: BankApp.storeT): Promise<number> => {
		try {
			const id = await Db.conn(bankAppTable)
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

	export const updateOneById = async (id: number, data: BankApp.updateT) => {
		return Db.conn(bankAppTable).where({ id }).update(data);
	};

	export const updateOneByCondition = async (where: Partial<BankApp.T>, data: BankApp.updateT) => {
		return Db.conn(bankAppTable).where({ ...where }).update(data);
	};

	export const deleteOneById = async (id: number) => {
		return Db.conn(bankAppTable).where({ id }).delete();
	};
}
