import { UserRoleEnum } from '@enums/userEnum';
import { BankAccount } from './bankAccounts';
import { BankApp } from './bankApps';

export namespace User {
    export const TableName = 'users';

    export type T = {

        id: number;
        serviceName: string;

        name: string;
        email: string;
        username: string;
        passwordEcd: string;
        role: UserRoleEnum;

        // User Auth
        accessToken: string;
        accessTokenExpire: Date;

        apiToken: string;
        apiTokenExpire: Date;

        externalApiToken: string;
        externalApiTokenExpire: Date;

        createdAt: Date;
        updatedAt: Date;
    };

    export type apiT = T & {
        bankApp: BankApp.Decrypted,
        bankAccountActive: BankAccount.T,
        bankAccounts: BankAccount.T[],
    };

    export type viewT = Omit<
        T,
        'passwordEcd' |
        'apiTokenExpire' |
        'externalApiToken' |
        'externalApiTokenExpire'
    >;

    export type backofficeViewT = T;

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