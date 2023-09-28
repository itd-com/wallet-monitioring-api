import { FastifyInstance } from 'fastify';
import { CommonValidator } from '@hooks/common';
import { AuthUserHook } from '@hooks/authUser';
import { AssetController } from '@controllers/backoffice/asset';

const backOfficeAssetRoute = async (app: FastifyInstance) => {
    app.get(
        '/asset/wallet',
        {
            preHandler: [
                CommonValidator.postValidator,
                AuthUserHook.verifyAccessTokenExpired,
            ],
        },
        AssetController.getWallet,
    );
};

export default backOfficeAssetRoute;