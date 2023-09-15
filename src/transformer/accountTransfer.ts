import { FastifyRequest } from 'fastify';

export namespace AccountTransferTransformer {
    export namespace createBankTransfer {
        export type Request = FastifyRequest<{
            Body: {
                accountNo: string,
                bankCode: string,
                amount: string,
            }
        }>;

        export type ResponseData = any;
    }
}