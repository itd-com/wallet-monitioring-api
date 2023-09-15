import { config } from '@config/config';
import { TopupHistory } from '../models/topupHistories';
import { TopupHistoryRepo } from '../repositories/topupHistories';
import { CustomError } from '@helpers/customError';

export namespace TopupHistoryService {
	export const getOneByCondition = async (where: Partial<TopupHistory.T>): Promise<TopupHistory.T | undefined> => {
		return TopupHistoryRepo.queryOneByCondition(where);
	};
	export const getManyByCondition = async (where?: Partial<TopupHistory.T>): Promise<TopupHistory.T[]> => {
		return TopupHistoryRepo.queryManyByCondition(where);
	};

	export const createOne = async (data: TopupHistory.storeT): Promise<number> => {
		return TopupHistoryRepo.insertOne(data);
	};

	export const updateOneById = async (id: number, data: TopupHistory.updateT) => {
		return TopupHistoryRepo.updateOneById(id, data);
	};

	export const deleteOneById = async (id: number) => {
		return TopupHistoryRepo.deleteOneById(id);
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
		return TopupHistoryRepo.getBankAccountTodayTopUpTruemoneyBalance(filter);
	};

	export const validateTopupToNumberLimitIn24Hours = async (
		validate: {
			type: string,
			toNumber: string,
			amount: number,
		},
	): Promise<void> => {
		const topupToNumberLimitIn24Hours = config.TOPUP_TO_NUMBER_LIMIT_IN_24_HOURS;
		const topupIn24Hours = await TopupHistoryRepo.getTopupTotalVolumeIn24HoursByToNumber({
			type: validate.type,
			toNumber: validate.toNumber,
		});

		if ((Number(topupIn24Hours.topupTotalVolume) + Number(validate.amount)) > Number(topupToNumberLimitIn24Hours)) {
			throw new CustomError({
				statusCode: 503,
				message: 'LIMITED_TOPUP_TO_NUMBER',
			});
		}
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
		return TopupHistoryRepo.getTopupTotalVolumeToDay(filter);
	};
}
