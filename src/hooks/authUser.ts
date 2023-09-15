import { FastifyRequest } from 'fastify';
import { isPast } from 'date-fns';
import { CustomError } from '@helpers/customError';
import { AuthorizationTokenExpired, AuthorizationTokenInvalid, AuthorizationTokenNotFound, NoAuthorizationHeader } from '../errors/auth';
import { UserRoleEnum } from '@enums/userEnum';
import { UserService } from '@domain/user/services/users';
import { User } from '@domain/user/models/users';
import { OpensslHelper } from '@helpers/openssl';

export namespace AuthUserHook {

    export const getUserApi = (request: FastifyRequest): User.apiT => {
        if (request.userApi) return request.userApi;
        throw new CustomError({
            statusCode: 500,
            message: 'userApi not found.',
        });
    };

    export const getAccessTokenFromRequest = (request: FastifyRequest): string => {
        const accessToken = request.headers?.authorization || '';
        if (!accessToken) {
            throw new CustomError(NoAuthorizationHeader);
        }

        return `${accessToken}`;
    };

    export const getApiTokenFromRequest = (request: FastifyRequest): string => {
        const accessToken = request.headers?.['api-token'] || '';
        if (!accessToken) {
            throw new CustomError(NoAuthorizationHeader);
        }

        return `${accessToken}`;
    };

    export const verifyAccessTokenExpired = async (request: FastifyRequest): Promise<void> => {
        const authorizationEnc = getAccessTokenFromRequest(request);
        try {
            const authorizationDec = OpensslHelper.privateDecrypt(authorizationEnc);
            const splitToken = authorizationDec.split('=');
            if (splitToken.length !== 2) {
                throw new CustomError(AuthorizationTokenInvalid);
            }
            // const user = await UserService.getOneByCondition({
            //     username: splitToken[0],
            //     accessTokenExpire: new Date(splitToken[1]),
            // });
            const user = await UserService.getOneByCondition({
                username: splitToken[0],
            });
            if (!user) {
                throw new CustomError(AuthorizationTokenNotFound);
            }

            const isTokenExpired = isPast(new Date(user.accessTokenExpire));
            if (isTokenExpired) {
                throw new CustomError(AuthorizationTokenExpired);
            }

            const userApi: User.apiT = {
                ...user,
            };

            Object.assign(request, { userApi });

            return Promise.resolve();
        } catch (error) {
            if (error.code === 'ERR_OSSL_RSA_OAEP_DECODING_ERROR') {
                throw new CustomError(AuthorizationTokenInvalid);
            }
            throw error;
        }
    };

    export const verifyAdminRole = async (request: FastifyRequest): Promise<void> => {
        const user = getUserApi(request);
        if (user.role !== UserRoleEnum.ADMIN) {
            throw new CustomError({
                message: 'Authorization Role is invalid',
                statusCode: 401,
            });
        }
        return Promise.resolve();
    };
}
