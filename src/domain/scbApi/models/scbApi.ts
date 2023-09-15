export namespace ScbApi {
	export namespace transactionsResponse {
		export interface Transaction {
			txnBatchRunDate: string | null;
			txnSequence: number;
			sortSequence: number;
			txnDateTime: string;
			txnAmount: number;
			txnCurrency: string;
			txnDebitCreditFlag: string;
			txnRemark: string;
			annotation: any; // You can replace 'any' with a specific type if needed
			txnChannel: {
				code: string;
				description: string;
			};
			txnCode: {
				code: string;
				description: string;
			};
		}

		export interface Data {
			status: {
				code: number;
				header: string;
				description: string;
			};
			data: {
				accountNo: string;
				txnList: Transaction[];
				pageSize: number;
				nextPageNumber: number | null;
				endOfListFlag: string;
			} | null;
		}
	}
}