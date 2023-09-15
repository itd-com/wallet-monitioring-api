import { User } from '@domain/account/models/users';
import { UserRoleEnum } from '@enums/userEnum';
import { FastifyRequest } from 'fastify';

export namespace BackOfficeUserTransformer {
    export namespace createUser {
        export type Request = FastifyRequest<{
            Body: {
                serviceName: string;

                name: string;
                email: string;
                username: string;
                password: string;
                role: UserRoleEnum;
            };
        }>;

        export type ResponseData = User.backofficeViewT;
    }

    export namespace getUsers {
        export type Request = FastifyRequest;

        export type ResponseData = User.backofficeViewT[];
    }

    export namespace getUserById {
        export type Request = FastifyRequest<{
            Params: {
                userId: number;
            };
        }>;

        export type ResponseData = User.backofficeViewT;
    }

    export namespace updateUserById {
        export type Request = FastifyRequest<{
            Params: {
                userId: number;
            };
            Body: {
                serviceName?: string;

                name?: string;
                email?: string;
                username?: string;
                password?: string;
                role?: UserRoleEnum;

                accessToken?: string;
                accessTokenExpire?: string;

                apiToken?: string;
                apiTokenExpire?: string;

                externalApiToken?: string;
                externalApiTokenExpire?: string;
            }
        }>;

        export type ResponseData = User.backofficeViewT;
    }
}