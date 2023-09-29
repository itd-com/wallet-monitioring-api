export namespace OnchainTxn {
    export const TableName = 'onchainTxns';

    export type T = {
        id: number;

        baseCurrency: string;

        txnID: string;
        value: string | null;

        networkFee: string | null;
        networkFeeUnit: string | null;

        fee: string | null;
        feeUnit: string | null;

        txnAt: Date | null;

        createdAt: Date;
        updatedAt: Date;
    };

    export type viewT = Omit<
        T,
        'id'
    >;

    export type backofficeViewT = T;

    export type storeT = Omit<
        T,
        'id' |
        'createdAt' |
        'updatedAt'
    >;

}