import { KnowledgeBasedUrl } from '@domain/knowledge/models/knowledgeBasedUrl';
import { NetworkFeeAsset } from '@domain/networkFee/models/networkFeeAssets';
import { FastifyRequest } from 'fastify';

export namespace BackOfficeKnowledgeBasedUrlTransformer {
    export namespace getBasedUrl {
        export type Request = FastifyRequest<{
        }>;

        export type ResponseData = KnowledgeBasedUrl.backofficeViewT[];
    }
}