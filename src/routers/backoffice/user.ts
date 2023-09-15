import { AuthController } from '@controllers/backoffice/auth';
import { FastifyInstance } from 'fastify';
import { BackOfficeUserSchema } from './schema/user';
import { CommonValidator } from '@hooks/common';
import { BackOfficeUserController } from '@controllers/backoffice/user';
import { AuthUserHook } from '@hooks/authUser';

const backOfficeUserRoute = async (app: FastifyInstance) => {
    app.post(
        '/user',
        {
            schema: BackOfficeUserSchema.createUser,
            preHandler: [
                CommonValidator.postValidator,
                AuthUserHook.verifyAccessTokenExpired,
            ],
        },
        BackOfficeUserController.createUser,
    );
    app.get(
        '/user',
        {
            schema: BackOfficeUserSchema.getUsers,
            preHandler: [
                CommonValidator.postValidator,
                AuthUserHook.verifyAccessTokenExpired,
            ],
        },
        BackOfficeUserController.getUsers,
    );
    app.get(
        '/user/:userId',
        {
            schema: BackOfficeUserSchema.getUserById,
            preHandler: [
                CommonValidator.postValidator,
                AuthUserHook.verifyAccessTokenExpired,
            ],
        },
        BackOfficeUserController.getUserById,
    );
    app.post(
        '/user/:userId',
        {
            schema: BackOfficeUserSchema.updateUserById,
            preHandler: [
                CommonValidator.postValidator,
                AuthUserHook.verifyAccessTokenExpired,
            ],
        },
        BackOfficeUserController.updateUserById,
    );
};

export default backOfficeUserRoute;