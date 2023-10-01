import { KnowledgeBasedUrl } from '@domain/knowledge/models/knowledgeBasedUrl';
import { NetworkFeeAsset } from '@domain/networkFee/models/networkFeeAssets';
import { FastifyRequest } from 'fastify';

export namespace BackOfficeKnowledgeBasedUrlTransformer {
    export namespace createBasedUrl {
        export type Request = FastifyRequest<{
            Body: {
                url: string;
                description?: string;
                note?: string;
            }
        }>;

        export type ResponseData = KnowledgeBasedUrl.backofficeViewT[];
    }

    export namespace getBasedUrl {
        export type Request = FastifyRequest<{
        }>;

        export type ResponseData = KnowledgeBasedUrl.backofficeViewT[];
    }

    export namespace getBasedUrlById {
        export type Request = FastifyRequest<{
            Params: {
                id: number;
            };
        }>;

        export type ResponseData = KnowledgeBasedUrl.backofficeViewT;
    }

    export namespace updateBasedUrl {
        export type Request = FastifyRequest<{
            Params: {
                id: number;
            };
            Body: {
                url: string;
                description?: string;
                note?: string;
            }
        }>;

        export type ResponseData = KnowledgeBasedUrl.backofficeViewT;
    }

    export namespace deleteBasedUrl {
        export type Request = FastifyRequest<{
            Params: {
                id: number;
            };
        }>;

        export type ResponseData = undefined;
    }
}