import { CustomError } from '@helpers/customError';
import { Db } from '../../db';
import { PaymentHistory } from '../models/qrPaymentHistories';
import { DuplicateEntry } from '../../../errors/database';

export namespace PaymentHistoryRepo {
	const paymentHistoriesTable = PaymentHistory.TableName;

	export const queryOneByCondition = async (where: Partial<PaymentHistory.T>): Promise<PaymentHistory.T | undefined> => {
		return Db.conn(paymentHistoriesTable).select().where({ ...where }).first();
	};

	export const queryManyByCondition = async (where?: Partial<PaymentHistory.T>): Promise<PaymentHistory.T[]> => {
		if (where) {
			return Db.conn(paymentHistoriesTable)
				.select()
				.where({ ...where });
		}
		return Db.conn(paymentHistoriesTable).select();
	};

	export const insertOne = async (data: PaymentHistory.storeT): Promise<number> => {
		try {
			const id = await Db.conn(paymentHistoriesTable)
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

	export const updateOneById = async (id: number, data: PaymentHistory.updateT) => {
		return Db.conn(paymentHistoriesTable).where({ id }).update(data);
	};

	export const deleteOneById = async (id: number) => {
		return Db.conn(paymentHistoriesTable).where({ id }).delete();
	};
}
