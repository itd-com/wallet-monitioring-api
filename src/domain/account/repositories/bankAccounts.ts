import { CustomError } from '@helpers/customError';
import { Db } from '../../db';
import { BankAccount } from '../models/bankAccounts';
import { DuplicateEntry } from '../../../errors/database';
import Decimal from 'decimal.js';

export namespace BankAccountRepo {
	const bankAccountsTable = BankAccount.TableName;

	export const queryOneByCondition = async (where: Partial<BankAccount.T>): Promise<BankAccount.T | undefined> => {
		return Db.conn(bankAccountsTable).select().where({ ...where }).first();
	};

	export const queryManyByCondition = async (where?: Partial<BankAccount.T>): Promise<BankAccount.T[]> => {
		if (where) {
			return Db.conn(bankAccountsTable)
				.select()
				.where({ ...where });
		}
		return Db.conn(bankAccountsTable).select();
	};

	export const queryManyByConditionAndOrderBy = async (
		where: Partial<BankAccount.T>,
		order: {
			column: string,
			by: 'asc' | 'desc',
		},
	): Promise<BankAccount.T[]> => {
		if (where) {
			return Db.conn(bankAccountsTable)
				.select()
				.where({ ...where })
				.orderBy(order.column, order.by);
		}
		return Db.conn(bankAccountsTable).select();
	};

	export const insertOne = async (data: BankAccount.storeT): Promise<number> => {
		try {
			const id = await Db.conn(bankAccountsTable)
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

	export const updatePushNumberById = async (
		id: number,
		value: {
			column: string,
			push: number,
		},
	) => {
		const amount = `${new Decimal(value.push).toFixed(2)}`;
		return Db.conn(bankAccountsTable).where({ id }).update(
			value.column, Db.conn.raw('?? + ?', [value.column, Number(amount)])
		);
	};

	export const updateDownNumberById = async (
		id: number,
		value: {
			column: string,
			down: number,
		},
	) => {
		const amount = `${new Decimal(value.down).toFixed(2)}`;
		return Db.conn(bankAccountsTable).where({ id }).update(
			value.column, Db.conn.raw('?? - ?', [value.column, Number(amount)])
		)
	};

	export const updateTodayTopUpTruemoneyBalanceById = async (id: number, amount: number) => {
		return Db.conn(bankAccountsTable).where({ id }).update({
			todayTopUpTruemoneyBalance: Db.conn.raw('?? + ?', ['todayTopUpTruemoneyBalance', amount])
		})
	};

	export const updateOneById = async (id: number, data: BankAccount.updateT) => {
		return Db.conn(bankAccountsTable).where({ id }).update(data);
	};

	export const updateOneByCondition = async (where: Partial<BankAccount.T>, data: BankAccount.updateT) => {
		return Db.conn(bankAccountsTable).where({ ...where }).update(data);
	};

	export const deleteOneById = async (id: number) => {
		return Db.conn(bankAccountsTable).where({ id }).delete();
	};
}
