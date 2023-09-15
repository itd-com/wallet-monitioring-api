import { CommonValidator } from '@hooks/common';
import { FastifyInstance } from 'fastify';
import { AuthBankAppHook } from '@hooks/authBankApp';
import { AccountTransferSchema } from './schema/accountTransfer';
import { AccountTransferController } from '@controllers/accountTransfer';
import { AuthUserHook } from '@hooks/authUser';

const accountTransferRoute = async (app: FastifyInstance) => {
    app.post(
        '/account/transfer/bank-to-bank',
        {
            schema: AccountTransferSchema.createBankTransfer,
            preHandler: [
                CommonValidator.postValidator,
                AuthUserHook.verifyApiTokenExpired,
                AuthBankAppHook.login,
                AuthBankAppHook.setBankAccountActiveForCreateRequsetServiceBankTransfer,
            ],
        },
        AccountTransferController.createBankTransfer,
    );
};

export default accountTransferRoute;
