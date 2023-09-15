import { PaymentHistory } from '../models/qrPaymentHistories';
import { PaymentHistoryRepo } from '../repositories/qrPaymentHistories';

export namespace PaymentHistoryService {
	export const getOneByCondition = async (where: Partial<PaymentHistory.T>): Promise<PaymentHistory.T | undefined> => {
		return PaymentHistoryRepo.queryOneByCondition(where);
	};
	export const getManyByCondition = async (where?: Partial<PaymentHistory.T>): Promise<PaymentHistory.T[]> => {
		return PaymentHistoryRepo.queryManyByCondition(where);
	};

	export const createOne = async (data: PaymentHistory.storeT): Promise<number> => {
		return PaymentHistoryRepo.insertOne(data);
	};

	export const updateOneById = async (id: number, data: PaymentHistory.updateT) => {
		return PaymentHistoryRepo.updateOneById(id, data);
	};

	export const deleteOneById = async (id: number) => {
		return PaymentHistoryRepo.deleteOneById(id);
	};
}
