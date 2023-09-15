import { FastifyInstance } from 'fastify';
import { CommonValidator } from '@hooks/common';
import { AuthUserHook } from '@hooks/authUser';
import { BackOfficeBankAccountSchema } from './schema/bankAccount';
import { BackOfficeBankAccountController } from '@controllers/backoffice/bankAccount';

const backOfficeBankAccountRoute = async (app: FastifyInstance) => {
    app.post(
        '/bank-account',
        {
            schema: BackOfficeBankAccountSchema.createBankAccount,
            preHandler: [
                CommonValidator.postValidator,
                AuthUserHook.verifyAccessTokenExpired,
            ],
        },
        BackOfficeBankAccountController.createBankAccount,
    );
    app.get(
        '/bank-account',
        {
            schema: BackOfficeBankAccountSchema.getBankAccounts,
            preHandler: [
                CommonValidator.postValidator,
                AuthUserHook.verifyAccessTokenExpired,
            ],
        },
        BackOfficeBankAccountController.getBankAccounts,
    );
    app.get(
        '/bank-account/:bankAccountId',
        {
            schema: BackOfficeBankAccountSchema.getBankAccountById,
            preHandler: [
                CommonValidator.postValidator,
                AuthUserHook.verifyAccessTokenExpired,
            ],
        },
        BackOfficeBankAccountController.getBankAccountById,
    );
    app.post(
        '/bank-account/:bankAccountId',
        {
            schema: BackOfficeBankAccountSchema.updateBankAccountById,
            preHandler: [
                CommonValidator.postValidator,
                AuthUserHook.verifyAccessTokenExpired,
            ],
        },
        BackOfficeBankAccountController.updateBankAccountById,
    );
};

export default backOfficeBankAccountRoute;