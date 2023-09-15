import { AuthController } from '@controllers/backoffice/auth';
import { FastifyInstance } from 'fastify';
import { AuthSchema } from './schema/auth';
import { CommonValidator } from '@hooks/common';
import { AuthUserHook } from '@hooks/authUser';

const authRoute = async (app: FastifyInstance) => {
    app.get(
        '/auth/me',
        {
            schema: AuthSchema.getMe,
            preHandler: [
                CommonValidator.postValidator,
                AuthUserHook.verifyAccessTokenExpired,
            ],
        },
        AuthController.getMe,
    );
    app.post(
        '/auth/login',
        {
            schema: AuthSchema.login,
            preHandler: [
                CommonValidator.postValidator,
            ],
        },
        AuthController.login,
    );
};

export default authRoute;