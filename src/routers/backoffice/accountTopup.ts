import { CommonValidator } from '@hooks/common';
import { FastifyInstance } from 'fastify';
import { AuthUserHook } from '@hooks/authUser';
import { BackOfficeAccountTopupSchema } from './schema/accountTopup';
import { BackOfficeAccountTopupController } from '@controllers/backoffice/accountTopup';

const backOfficeAccountTopupRoute = async (app: FastifyInstance) => {
    app.get(
        '/account/topup',
        {
            schema: BackOfficeAccountTopupSchema.getAccountTopup,
            preHandler: [
                CommonValidator.postValidator,
                AuthUserHook.verifyAccessTokenExpired,
            ],
        },
        BackOfficeAccountTopupController.getAccountTopup,
    );
};

export default backOfficeAccountTopupRoute;