import { CustomError } from '@helpers/customError';
import { Db } from '../../db';
import { TopupHistory } from '../models/topupHistories';
import { DuplicateEntry } from '../../../errors/database';
import { TopupStatusEnum } from '@enums/topupEnum';
import { BankAccount } from '@domain/account/models/bankAccounts';
import { BankAccountService } from '@domain/account/services/bankAccounts';
import { format } from 'date-fns-tz';

export namespace TopupHistoryRepo {
	const topupHistoriesTable = TopupHistory.TableName;

	export const queryOneByCondition = async (where: Partial<TopupHistory.T>): Promise<TopupHistory.T | undefined> => {
		return Db.conn(topupHistoriesTable).select().where({ ...where }).first();
	};

	export const queryManyByCondition = async (where?: Partial<TopupHistory.T>): Promise<TopupHistory.T[]> => {
		if (where) {
			return Db.conn(topupHistoriesTable)
				.select()
				.where({ ...where });
		}
		return Db.conn(topupHistoriesTable).select();
	};

	export const insertOne = async (data: TopupHistory.storeT): Promise<number> => {
		try {
			const id = await Db.conn(topupHistoriesTable)
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

	export const updateOneById = async (id: number, data: TopupHistory.updateT) => {
		return Db.conn(topupHistoriesTable).where({ id }).update(data);
	};

	export const deleteOneById = async (id: number) => {
		return Db.conn(topupHistoriesTable).where({ id }).delete();
	};

	const queryGetBankAccountTodayTopUpTruemoneyBalance = async (
		filter: {
			serviceName?: number;
			bankAppId?: number;
			bankAccountNo?: string,
			topupTotalVolumeMin?: number,
			topupTotalVolumeMax?: number,
		},
	): Promise<{
		topupTotalVolume: number;
		bankAppId: number;
		serviceName: string;
		bankAccountNo: string;
	}[]> => {

		const masterQuery = Db.conn('topupHistories as th')
			.columns(
				Db.conn.raw(
					`SUM(CASE WHEN (th.amount IS NOT NULL) THEN th.amount ELSE 0 END) AS topupTotalVolume`,
				),
				Db.conn.raw(
					`ba.serviceName as serviceName`,
				),
				Db.conn.raw(
					`ba.bankAppId as bankAppId`,
				),
				Db.conn.raw(
					`ba.bankAccountNo as bankAccountNo`,
				),
			)
			.innerJoin('bankAccounts as ba', `ba.id`, `th.bankAccountId`)
			.where('th.status', TopupStatusEnum.SUCCESS)
			.andWhereRaw(
				`th.txnAt IS NULL OR DATE(th.txnAt) = CURDATE())`,
			)
			.clone();

		if (filter.serviceName) {
			masterQuery.andWhereRaw(
				`ba.serviceName = ?`, [`${filter.serviceName}`]
			);
			masterQuery.groupByRaw(`ba.bankAccountNo`);
		}
		if (filter.bankAppId) {
			masterQuery.andWhereRaw(
				`ba.bankAppId = ?`, [`${filter.bankAppId}`]
			);
			masterQuery.groupByRaw(`ba.bankAccountNo`);
		}
		if (filter.bankAccountNo) {
			masterQuery.andWhereRaw(
				`ba.bankAccountNo = ?`, [`${filter.bankAccountNo}`]
			);
		}

		if (filter.topupTotalVolumeMax) {
			masterQuery.havingRaw(`topupTotalVolume <= ?`, [filter.topupTotalVolumeMax]);
		}

		if (filter.topupTotalVolumeMin) {
			masterQuery.havingRaw(`topupTotalVolume >= ?`, [filter.topupTotalVolumeMin]);
		}

		return masterQuery;
	};

	export const getBankAccountTodayTopUpTruemoneyBalance = async (
		filter: {
			serviceName?: number;
			bankAppId?: number;
			bankAccountNo?: string,
			topupTotalVolumeMin?: number,
			topupTotalVolumeMax?: number,
		},
	): Promise<{
		topupTotalVolume: number;
		bankAppId: number;
		serviceName: string;
		bankAccountNo: string;
	}[]> => {

		const bankAccountTodayTopUpTruemoneyBalance = await queryGetBankAccountTodayTopUpTruemoneyBalance(filter);

		return bankAccountTodayTopUpTruemoneyBalance;
	};


	export const getTopupTotalVolumeIn24HoursByToNumber = async (
		filter: {
			toNumber: string;
			type: string;
		},
	): Promise<{
		topupTotalVolume: number;
		payee: string;
	}> => {

		const now = new Date();
		const nowStr = format(now, 'yyyy-MM-dd HH:mm:ss', { timeZone: 'Asia/Bangkok' })

		const masterQuery = Db.conn('topupHistories as th')
			.columns(
				Db.conn.raw(
					`SUM(CASE WHEN (th.amount IS NOT NULL) THEN th.amount ELSE 0 END) AS topupTotalVolume`,
				),
				Db.conn.raw(
					`th.payee as payee`,
				),
			)
			.where('th.status', TopupStatusEnum.SUCCESS)
			.andWhere('th.payee', filter.toNumber)
			.andWhere('th.type', filter.type)
			.andWhereRaw(`CONVERT_TZ(th.txnAt, '+00:00', '+07:00') < '${nowStr}'`)
			.andWhereRaw(`CONVERT_TZ(th.txnAt, '+00:00', '+07:00') >= ('${nowStr}' - INTERVAL 1 DAY)`)
			.clone();

		const row = await masterQuery.first();

		return {
			topupTotalVolume: row?.topupTotalVolume ? Number(row.topupTotalVolume) : 0,
			payee: row?.payee || filter.toNumber,
		};
	};

	export const getTopupTotalVolumeToDay = async (
		filter: {
			bankAccountNo: string;
			type: string;
		},
	): Promise<{
		topupTotalVolume: number;
		bankAccountNo: string;
	}> => {

		const now = new Date();
		const nowDateStr = format(now, 'yyyy-MM-dd', { timeZone: 'Asia/Bangkok' })

		const masterQuery = Db.conn('topupHistories as th')
			.columns(
				Db.conn.raw(
					`SUM(CASE WHEN (th.amount IS NOT NULL) THEN th.amount ELSE 0 END) AS topupTotalVolume`,
				),
				Db.conn.raw(
					`th.payee as payee`,
				),
			)
			.innerJoin('bankAccounts as ba', `ba.id`, `th.bankAccountId`)
			.where('th.status', TopupStatusEnum.SUCCESS)
			.andWhere('ba.bankAccountNo', filter.bankAccountNo)
			.andWhere('th.type', filter.type)
			.andWhereRaw(`DATE(CONVERT_TZ(th.txnAt, '+00:00', '+07:00')) = '${nowDateStr}'`)
			.clone();

		const row = await masterQuery.first();

		return {
			topupTotalVolume: row?.topupTotalVolume ? Number(row.topupTotalVolume) : 0,
			bankAccountNo: row?.payee || filter.bankAccountNo,
		};
	};

}
