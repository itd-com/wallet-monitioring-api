import { FastifyInstance } from 'fastify';
import { CommonValidator } from '@hooks/common';
import { AuthUserHook } from '@hooks/authUser';
import { OnchainTxnController } from '@controllers/backoffice/onchainTxn';

const onchainTxnRoute = async (app: FastifyInstance) => {
    app.get(
        '/txn/onchain-testnet/BTC_TEST',
        {
            preHandler: [
                CommonValidator.postValidator,
                AuthUserHook.verifyAccessTokenExpired,
            ],
        },
        OnchainTxnController.getOnchainTestnet,
    );
};

export default onchainTxnRoute;