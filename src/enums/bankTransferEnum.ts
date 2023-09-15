export enum BankTransferTypeEnum {
	TRANSFER_IN = 'TRANSFER_IN',
	TRANSFER_OUT = 'TRANSFER_OUT'
}

export enum BankTransferStatusEnum {
	IN_PROGRESS = 'IN_PROGRESS',
	PENDING = 'PENDING',
	SUCCESS = 'SUCCESS',
	ERROR = 'ERROR',
	TIMEOUT = 'TIMEOUT',
	REJECT = 'REJECT',
}