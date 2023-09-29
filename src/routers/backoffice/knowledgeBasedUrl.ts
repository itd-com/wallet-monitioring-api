import { FastifyInstance } from 'fastify';
import { CommonValidator } from '@hooks/common';
import { AuthUserHook } from '@hooks/authUser';
import { KnowledgeBasedUrlController } from '@controllers/backoffice/knowledgeBasedUrl';

const knowledgeBasedUrlRoute = async (app: FastifyInstance) => {
    app.get(
        '/knowledge/based-url',
        {
            preHandler: [
                CommonValidator.postValidator,
                AuthUserHook.verifyAccessTokenExpired,
            ],
        },
        KnowledgeBasedUrlController.getBasedUrl,
    );
};

export default knowledgeBasedUrlRoute;