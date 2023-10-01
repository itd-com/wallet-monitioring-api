import { FastifyInstance } from 'fastify';
import { CommonValidator } from '@hooks/common';
import { AuthUserHook } from '@hooks/authUser';
import { KnowledgeBasedUrlController } from '@controllers/backoffice/knowledgeBasedUrl';

const knowledgeBasedUrlRoute = async (app: FastifyInstance) => {
    app.get(
        '/knowledge-based-url',
        {
            preHandler: [
                CommonValidator.postValidator,
                AuthUserHook.verifyAccessTokenExpired,
            ],
        },
        KnowledgeBasedUrlController.getBasedUrl,
    );
    app.get(
        '/knowledge-based-url/:id',
        {
            preHandler: [
                CommonValidator.postValidator,
                AuthUserHook.verifyAccessTokenExpired,
            ],
        },
        KnowledgeBasedUrlController.getBasedUrlById,
    );
    app.put(
        '/knowledge-based-url/:id',
        {
            preHandler: [
                CommonValidator.postValidator,
                AuthUserHook.verifyAccessTokenExpired,
            ],
        },
        KnowledgeBasedUrlController.updateBasedUrl,
    );
    app.delete(
        '/knowledge-based-url/:id',
        {
            preHandler: [
                CommonValidator.postValidator,
                AuthUserHook.verifyAccessTokenExpired,
            ],
        },
        KnowledgeBasedUrlController.deleteBasedUrl,
    );
    app.post(
        '/knowledge-based-url',
        {
            preHandler: [
                CommonValidator.postValidator,
                AuthUserHook.verifyAccessTokenExpired,
            ],
        },
        KnowledgeBasedUrlController.createBasedUrl,
    );
};

export default knowledgeBasedUrlRoute;