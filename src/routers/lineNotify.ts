import { CommonValidator } from '@hooks/common';
import { FastifyInstance } from 'fastify';
import { AccountSchema } from './schema/account';
import { AuthBankAppHook } from '@hooks/authBankApp';
import { AccountController } from '@controllers/account';
import { AuthUserHook } from '@hooks/authUser';

const lineNofifyRoute = async (app: FastifyInstance) => {
    app.get(
        '/notify',
        {
            preHandler: [
                CommonValidator.postValidator,
                AuthUserHook.verifyExternalApiTokenExpired,
                AuthBankAppHook.login,
            ],
        },
        AccountController.notifyAccountSummary,
    );
};

export default lineNofifyRoute;