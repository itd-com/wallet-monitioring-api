import { FastifyRequest } from 'fastify';

export namespace AccountTransformer {
    export namespace getAccountTransactions {
        export type Request = FastifyRequest<{
            Querystring: {
                accountNo: string;
                startAt: string;
                endAt: string;
            }
        }>;

        export type ResponseData = any;
    }

    export namespace getAccountSummary {
        export type Request = FastifyRequest;

        export type ResponseData = any;
    }
}