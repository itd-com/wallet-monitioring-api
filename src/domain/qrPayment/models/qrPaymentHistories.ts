import { PaymentStatusEnum, PaymentTypeEnum } from '@enums/paymentEnum';

export namespace PaymentHistory {
	export const TableName = 'qrPaymentHistories';

	export type T = {
		id: number;
		requestId: string;
		serviceName: string;
		bankAppId: number;
		bankAccountId: number;

		type: PaymentTypeEnum;
		status: PaymentStatusEnum;

		amount: string;
		fee: string | null;
		netAmount: string | null;

		feeSysId: number | null;
		feeSysTxnBatch: string | null;

		payer: string | null;
		payee: string | null;

		startAt: Date;
		txnAt: Date | null;
		endAt: Date;

		qrCodePaymentURL: string | null;
		requestAmount: number;
		requestMemo: number; // 1 - 99

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
