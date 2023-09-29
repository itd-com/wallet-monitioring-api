import { NetworkFeeAsset } from '@domain/networkFee/models/networkFeeAssets';
import { OnchainTxn } from '@domain/txn/models/onchainTxn';
import { FastifyRequest } from 'fastify';

export namespace BackOfficeOnchainTxnTransformer {
    export namespace getOnchainTestnet {
        export type Request = FastifyRequest<{
        }>;

        export type ResponseData = OnchainTxn.backofficeViewT[];
    }
}