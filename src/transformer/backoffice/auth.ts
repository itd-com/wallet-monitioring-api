import { User } from '@domain/user/models/users';
import { FastifyRequest } from 'fastify';

export namespace BackOfficeAuthTransformer {
    export namespace getMe {
        export type Request = FastifyRequest;

        export type ResponseData = User.viewT;
    }

    export namespace login {
        export type Request = FastifyRequest<{
            Body: {
                usernameOrEmail: string;
                password: string;
            }
        }>;

        export type ResponseData = User.viewT;
    }

    export namespace signup {
        export type Request = FastifyRequest<{
            Body: {
                username: string;
                password: string;
            }
        }>;

        export type ResponseData = User.viewT;
    }
}