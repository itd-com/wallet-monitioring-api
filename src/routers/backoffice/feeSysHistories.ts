import { FastifyInstance } from 'fastify';
import { CommonValidator } from '@hooks/common';
import { AuthUserHook } from '@hooks/authUser';
import { BackOfficeFeeSysHistorySchema } from './schema/feeSysHistories';
import { BackOfficeFeeSysHistoryController } from '@controllers/backoffice/feeSysHistories';

const backOfficeFeeSysHistoryRoute = async (app: FastifyInstance) => {
    app.get(
        '/fee-sys-history',
        {
            schema: BackOfficeFeeSysHistorySchema.getFeeSysHistorise,
            preHandler: [
                CommonValidator.postValidator,
                AuthUserHook.verifyAccessTokenExpired,
            ],
        },
        BackOfficeFeeSysHistoryController.getFeeSysHistorise,
    );
};

export default backOfficeFeeSysHistoryRoute;