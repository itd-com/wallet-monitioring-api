import { BankAccount } from '@domain/account/models/bankAccounts';
import { FastifyRequest } from 'fastify';

export namespace BackOfficeBankAccountTransformer {
    export namespace createBankAccount {
        export type Request = FastifyRequest<{
            Body: BankAccount.storeT;
        }>;

        export type ResponseData = BankAccount.T;
    }

    export namespace getBankAccounts {
        export type Request = FastifyRequest;

        export type ResponseData = BankAccount.T[];
    }

    export namespace getBankAccountById {
        export type Request = FastifyRequest<{
            Params: {
                bankAccountId: number;
            };
        }>;

        export type ResponseData = BankAccount.T;
    }

    export namespace updateBankAccountById {
        export type Request = FastifyRequest<{
            Params: {
                bankAccountId: number;
            };
            Body: BankAccount.updateT;
        }>;

        export type ResponseData = BankAccount.T;
    }
}