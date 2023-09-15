import { CommonValidator } from '@hooks/common';
import { FastifyInstance } from 'fastify';
import { AuthBankAppHook } from '@hooks/authBankApp';
import { AccountTopupSchema } from './schema/accountTopup';
import { AccountTopupController } from '@controllers/accountTopup';
import { AuthUserHook } from '@hooks/authUser';

const accountTopupRoute = async (app: FastifyInstance) => {
    // app.get(
    //     '/account/topup/config',
    //     {
    //         preHandler: [
    //             CommonValidator.postValidator,
    //             AuthAccountHook.verifyAccessTokenExpired,
    //             AuthAccountHook.bankAppLogin,
    //         ],
    //     },
    //     AccountTopupController.getAccountTopupConfig,
    // );
    app.post(
        '/account/topup',
        {
            schema: AccountTopupSchema.createAccountTopup,
            preHandler: [
                CommonValidator.postValidator,
                AuthUserHook.verifyApiTokenExpired,
                AuthBankAppHook.login,
                AuthBankAppHook.setBankAccountActiveForCreateRequsetServiceTopup,
            ],
        },
        AccountTopupController.createAccountTopup,
    );
};

export default accountTopupRoute;