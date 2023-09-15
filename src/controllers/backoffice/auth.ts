import { CustomError } from "@helpers/customError";
import { Utils } from "@helpers/utils";
import { BackOfficeAuthTransformer } from "@transformer/backoffice/auth";
import { addDays } from 'date-fns';
import { FastifyReply } from "fastify";
import { UserService } from "@domain/account/services/users";
import { OpensslHelper } from "@helpers/openssl";
import { AuthUserHook } from "@hooks/authUser";

export namespace AuthController {
    export const getMe = async (request: BackOfficeAuthTransformer.getMe.Request, reply: FastifyReply) => {
        const reqUser = AuthUserHook.getUserApi(request);
        const user = await UserService.getOneByCondition({
            id: reqUser.id,
        });
        if (!user) {
            throw new CustomError({
                statusCode: 404,
                message: `USER_NOT_FOUND`,
            });
        }

        const response: BackOfficeAuthTransformer.getMe.ResponseData = Utils.deleteProperties(
            {
                ...user,
            },
            []
        );
        return reply.code(200).send(response);
    };

    export const login = async (request: BackOfficeAuthTransformer.login.Request, reply: FastifyReply) => {
        const { username, password } = request.body;

        const user = await UserService.getOneByCondition({
            username,
        });
        if (!user) {
            throw new CustomError({
                statusCode: 422,
                message: `INVALID_USER`,
            });
        }

        if ((password.trim() !== OpensslHelper.privateDecrypt(user.passwordEcd))) {
            throw new CustomError({
                statusCode: 422,
                message: `INVALID_USER`,
            });
        }

        const newAccessToken = OpensslHelper.publicEncrypt(user.username);

        const newAccessTokenExpire = addDays(new Date(), 1);

        await UserService.updateOneById(user.id, {
            accessToken: newAccessToken,
            accessTokenExpire: newAccessTokenExpire,
        });

        const response: BackOfficeAuthTransformer.login.ResponseData = Utils.deleteProperties(
            {
                ...user,
                accessToken: newAccessToken,
                accessTokenExpire: newAccessTokenExpire,
            },
            [
                'passwordEcd',
                'apiTokenExpire',
                'externalApiToken',
                'externalApiTokenExpire'
            ],
        );
        return reply.code(200).send(response);
    };



}