import { FastifyInstance } from 'fastify';
import { CommonValidator } from '@hooks/common';
import { AuthUserHook } from '@hooks/authUser';
import { NetworkFeeController } from '@controllers/backoffice/networkFee';

const backOfficeNetworkFeeRoute = async (app: FastifyInstance) => {
    app.get(
        '/network-fee/current',
        {
            preHandler: [
                CommonValidator.postValidator,
                AuthUserHook.verifyAccessTokenExpired,
            ],
        },
        NetworkFeeController.getCurrent,
    );
    app.get(
        '/network-fee/schedule',
        {
            preHandler: [
                CommonValidator.postValidator,
                AuthUserHook.verifyAccessTokenExpired,
            ],
        },
        NetworkFeeController.getSchedule,
    );
};

export default backOfficeNetworkFeeRoute;