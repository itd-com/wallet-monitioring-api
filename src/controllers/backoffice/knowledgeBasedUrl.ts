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

        const knowledgeBaseUrl = await KnowledgeBasedUrlService.getManyByCondition();

        const response: BackOfficeKnowledgeBasedUrlTransformer.getBasedUrl.ResponseData = knowledgeBaseUrl;
        return reply.code(200).send(response);
    };

    export const getBasedUrlById = async (request: BackOfficeKnowledgeBasedUrlTransformer.getBasedUrlById.Request, reply: FastifyReply) => {
        const reqUser = AuthUserHook.getUserApi(request);
        const { id } = request.params;

        const knowledgeBaseUrl = await KnowledgeBasedUrlService.getOneByCondition({ id });
        if (!knowledgeBaseUrl) {
            throw new CustomError({
                statusCode: 404,
                message: `keynowledgeBaseUrls not found by id=${id}`,
            });
        }

        const response: BackOfficeKnowledgeBasedUrlTransformer.getBasedUrlById.ResponseData = knowledgeBaseUrl;
        return reply.code(200).send(response);
    };

    export const updateBasedUrl = async (request: BackOfficeKnowledgeBasedUrlTransformer.updateBasedUrl.Request, reply: FastifyReply) => {
        const reqUser = AuthUserHook.getUserApi(request);
        const { id } = request.params;

        const {
            url,
            description,
            note,
        } = request.body;

        const updateResult = await KnowledgeBasedUrlService.updateOneById(id, {
            url,
            description,
            note,
        });

        if (updateResult) {
            const knowledgeBaseUrl = await KnowledgeBasedUrlService.getOneByCondition({ id });
            const response: BackOfficeKnowledgeBasedUrlTransformer.updateBasedUrl.ResponseData = knowledgeBaseUrl!;
            return reply.code(200).send(response);
        }

        throw new CustomError({
            statusCode: 500,
            message: `Unable to update keynowledgeBaseUrls by id=${id}`,
        });


    };

    export const deleteBasedUrl = async (request: BackOfficeKnowledgeBasedUrlTransformer.deleteBasedUrl.Request, reply: FastifyReply) => {
        const reqUser = AuthUserHook.getUserApi(request);
        const { id } = request.params;

        const deleteResult = await KnowledgeBasedUrlService.deleteOneById(id);
        if (!!deleteResult) {
            throw new CustomError({
                statusCode: 500,
                message: `Unable to delete keynowledgeBaseUrls by id=${id}`,
            });
        }

        const response: BackOfficeKnowledgeBasedUrlTransformer.deleteBasedUrl.ResponseData = undefined;
        return reply.code(200).send(response);
    };

}