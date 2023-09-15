
export namespace BankAccount {
	export const TableName = 'bankAccounts';

	export type T = {

		id: number;
		name: string;
		serviceName: string;
		bankAppId: number;

		bankAccountBalance: number;
		todayTopUpTruemoneyBalance: number;

		enableServiceQrPayment: boolean;
		enableServiceTopup: boolean;
		enableServiceBankTransfer: boolean;

		bankAccountNo: string;
		bankAccountNoView: string;
		bankPromptPayNo: string | null;
		bankAccountNameTh: string;
		bankAccountNameEn: string;
		bankBranchName: string | null;

		createdAt: Date;
		updatedAt: Date;
	};

	export type viewT = Omit<
		T,
		'id'
	>;

	export type storeT = Omit<
		T,
		'id' |
		'createdAt' |
		'updatedAt'
	>;

	export type updateT = Partial<Omit<
		T,
		'id' |
		'createdAt' |
		'updatedAt'
	>>;
}