import { CustomError } from '@helpers/customError';
import { Db } from '../../db';
import { BankAccountTransferHistory } from '../models/bankAccountTransferHistories';

export namespace BankAccountTransferHistoryRepo {
	const bankAccountTransferHistoriesTable = BankAccountTransferHistory.TableName;

	export const queryOneByCondition = async (where: Partial<BankAccountTransferHistory.T>): Promise<BankAccountTransferHistory.T | undefined> => {
		return Db.conn(bankAccountTransferHistoriesTable).select().where({ ...where }).first();
	};

	export const queryManyByCondition = async (where?: Partial<BankAccountTransferHistory.T>): Promise<BankAccountTransferHistory.T[]> => {
		if (where) {
			return Db.conn(bankAccountTransferHistoriesTable)
				.select()
				.where({ ...where });
		}
		return Db.conn(bankAccountTransferHistoriesTable).select();
	};

	export const insertOne = async (data: BankAccountTransferHistory.storeT): Promise<number> => {
		try {
			const id = await Db.conn(bankAccountTransferHistoriesTable)
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

	export const updateOneById = async (id: number, data: BankAccountTransferHistory.updateT) => {
		return Db.conn(bankAccountTransferHistoriesTable).where({ id }).update(data);
	};

	export const deleteOneById = async (id: number) => {
		return Db.conn(bankAccountTransferHistoriesTable).where({ id }).delete();
	};
}
