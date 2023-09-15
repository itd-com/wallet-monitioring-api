import { TopupTypeEnum } from '@enums/topupEnum';
import { FastifyRequest } from 'fastify';

export namespace AccountTopupTransformer {
    export namespace createAccountTopup {
        export type Request = FastifyRequest<{
            Body: {
                type: TopupTypeEnum;
                toNumber: string;
                amount: string;
                note?: string;
            }
        }>;

        export type ResponseData = any;
    }

    export namespace getAccountTopupConfig {
        export type Request = FastifyRequest;

        export type ResponseData = any;
    }
}