import { BankTransferStatusEnum, BankTransferTypeEnum } from "@enums/bankTransferEnum";

export namespace FeeSysHistory {
	export const TableName = 'feeSysHistories';

	export type T = {
		id: number;
		requestId: string;
		serviceName: string;
		bankAppId: number;

		transferType: BankTransferTypeEnum;
		status: BankTransferStatusEnum;

		amount: string;
		fee: string | null;
		netAmount: string | null;

		action: string;
		payerId: string | null;
		payerNo: string | null;
		payeeId: string | null;
		payeeNo: string | null;

		txnAt: Date | null;
		txnBatch: string;

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
