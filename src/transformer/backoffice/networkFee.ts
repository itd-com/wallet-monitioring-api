import { NetworkFeeAsset } from '@domain/networkFee/models/networkFeeAssets';
import { FastifyRequest } from 'fastify';

export namespace BackOfficeNetworkFeeTransformer {
    export namespace getCurrent {
        export type Request = FastifyRequest<{
            Querystring: {
                currency?: string;
                sortBy?: string;
                dateFrom?: string;
                dateTo?: string;
            }
        }>;

        export type ResponseData = NetworkFeeAsset.backofficeViewT[];
    }

    export namespace getSchedule {
        export type Request = FastifyRequest<{
            Querystring: {
                currency?: string;
                sortBy?: string;
                dateFrom?: string;
                dateTo?: string;
            }
        }>;

        export type ResponseData = NetworkFeeAsset.backofficeViewT[];
    }
}