import { Asset } from '@domain/asset/models/asset';
import { NetworkFeeAsset } from '@domain/networkFee/models/networkFeeAssets';
import { FastifyRequest } from 'fastify';

export namespace BackOfficeAssetTransformer {
    // export namespace getTokenAllocation {
    //     export type Request = FastifyRequest<{
    //     }>;

    //     export type ResponseData = NetworkFeeAsset.viewT[];
    // }

    export namespace getWallet {
        export type Request = FastifyRequest<{
            Querystring: {
                vaultAccountId: string;
            }
        }>;

        export type ResponseData = Asset.wallet[];
    }
}