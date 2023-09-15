import { TopupStatusEnum, TopupTypeEnum } from '@enums/topupEnum';

export namespace TopupHistory {
	export const TableName = 'topupHistories';

	export type T = {
		id: number;
		requestId: string;
		serviceName: string;
		bankAppId: number;
		bankAccountId: number;

		type: TopupTypeEnum;
		status: TopupStatusEnum;

		amount: string;
		fee: string | null;
		netAmount: string | null;

		feeSysId: number | null;
		feeSysTxnBatch: string | null;

		payer: string | null;
		payee: string | null;

		startAt: Date | null;
		txnAt: Date | null;
		endAt: Date | null;

		data: string | null;
		thirdPartRequestId: string | null;
		thirdPartRequestData: string | null;
		thirdPartResponseData: string | null;
		thirdPartWebHookData: string | null;
		remark: string | null;

		createdAt: Date;
		updatedAt: Date;
	};

	export type viewT = T;

	export type storeT = Omit<
		T,
		'id' |
		'createdAt' |
		'updatedAt'
	>;

	export type updateT = Partial<Omit<
		T,
		'id' |
		'requestId' |
		'accountId' |
		'createdAt' |
		'updatedAt'
	>>;
}
