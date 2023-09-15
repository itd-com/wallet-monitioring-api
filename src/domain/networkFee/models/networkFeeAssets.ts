export namespace NetworkFeeAsset {
    export const TableName = 'networkFeeAssets';

    export type T = {
        id: number;

        baseCurrency: string;

        unit: string;
        feeLow: string | null;
        feeLowResponse: string | null;
        feeMedium: string | null;
        feeMediumResponse: string | null;
        feeHigh: string | null;
        feeHighResponse: string | null;

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