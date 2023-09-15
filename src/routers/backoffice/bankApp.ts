import { FastifyInstance } from 'fastify';
import { CommonValidator } from '@hooks/common';
import { AuthUserHook } from '@hooks/authUser';
import { BackOfficeBankAppSchema } from './schema/bankApp';
import { BackOfficeBankAppController } from '@controllers/backoffice/bankApp';

const backOfficeBankAppRoute = async (app: FastifyInstance) => {
    app.get(
        '/bank-app',
        {
            schema: BackOfficeBankAppSchema.getBankApps,
            preHandler: [
                CommonValidator.postValidator,
                AuthUserHook.verifyAccessTokenExpired,
            ],
        },
        BackOfficeBankAppController.getBankApps,
    );
};

export default backOfficeBankAppRoute;