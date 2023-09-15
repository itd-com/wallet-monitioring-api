import { BankTransferTypeEnum, BankTransferStatusEnum } from '@enums/bankTransferEnum';

export namespace BankAccountTransferHistory {
	export const TableName = 'bankAccountTransferHistories';

	export type T = {
		id: number;
		requestId: string;
		serviceName: string;
		bankAppId: number;
		bankAccountId: number;

		transferType: BankTransferTypeEnum;
		status: BankTransferStatusEnum;

		amount: string;
		fee: string | null;
		netAmount: string | null;

		feeSysId: number | null;
		feeSysTxnBatch: string | null;

		action: string;
		payerId: string | null;
		payerNo: string | null;
		payeeId: string | null;
		payeeNo: string | null;

		startAt: Date | null;
		txnAt: Date | null;
		endAt: Date | null;

		// QR Payment Data
		qrCodePaymentURL: string | null;
		requestAmount: number | null;
		requestMemo: number | null; // 1 - 99

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
		'bankAppId' |
		'bankAccountId' |
		'createdAt' |
		'updatedAt'
	>>;
}
