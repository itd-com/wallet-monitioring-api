import { UserRoleEnum } from '@enums/userEnum';

export namespace BankApp {
    export const TableName = 'bankApps';

    export type T = {
        id: number;
        name: string;
        serviceName: string;

        feePaymentRate: string;
        feeTopupRate: string;
        feeBankTransferRate: string;

        notifyToken1: string | null;
        notifyToken2: string | null;

        enableServiceQrPayment: boolean;
        enableServiceTopup: boolean;
        enableServiceBankTransfer: boolean;

        bankDeviceIdEcd: string;
        bankPinEcd: string;
        bankApiAuthRefreshEcd: string;
        bankApiAuthEcd: string;
        bankApiAuthExpire: Date;

        createdAt: Date;
        updatedAt: Date;
    };

    export type Decrypted = {
        id: number;
        name: string;
        serviceName: string;

        feePaymentRate: string;
        feeTopupRate: string;
        feeBankTransferRate: string;

        notifyToken1: string | null;
        notifyToken2: string | null;

        enableServiceQrPayment: boolean;
        enableServiceTopup: boolean;
        enableServiceBankTransfer: boolean;

        bankDeviceId: string;
        bankPin: string;
        bankApiAuthRefresh: string;
        bankApiAuth: string;
        bankApiAuthExpire: Date;

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