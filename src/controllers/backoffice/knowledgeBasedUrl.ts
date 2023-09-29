import { CustomError } from '@helpers/customError';
import { Utils } from '@helpers/utils';
import { addDays } from 'date-fns';
import { FastifyReply } from 'fastify';
import { AuthUserHook } from '@hooks/authUser';
import Decimal from 'decimal.js';
import { BackOfficeKnowledgeBasedUrlTransformer } from '@transformer/backoffice/knowledgeBasedUrl';
import { KnowledgeBasedUrlService } from '@domain/knowledge/services/knowledgeBasedUrl';

export namespace KnowledgeBasedUrlController {
    export const getBasedUrl = async (request: BackOfficeKnowledgeBasedUrlTransformer.getBasedUrl.Request, reply: FastifyReply) => {
        const reqUser = AuthUserHook.getUserApi(request);

        const txnTestnet = await KnowledgeBasedUrlService.getManyByCondition();

        const response: BackOfficeKnowledgeBasedUrlTransformer.getBasedUrl.ResponseData = txnTestnet;
        return reply.code(200).send(response);
    };

}