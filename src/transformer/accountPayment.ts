import { FastifyRequest } from 'fastify';

export namespace AccountPaymentTransformer {
    export namespace createQrPayment {
        export type Request = FastifyRequest<{
            Body: {
                amount: string;
            }
        }>;

        export type ResponseData = {
            requestId: string;
            requestAmount: number;
            requestMemo: number;
            amount: string;
            status: string;
            paymentAt: string | null,
            endAtNumber: number;
            type: string;
            qrCodePayment: {
                qrCodePaymentURL: string | null;
                bankPromptPayNo: string | null;
                bankAccountNo: string | null;
                bankCode: string | null;
                bankName: string | null;
                bankAccountNameEn: string | null;
                bankAccountNameTh: string | null;
            },
        };
    }

    export namespace getQrPayment {
        export type Request = FastifyRequest<{
            Params: {
                requestId: string;
            }
        }>;

        export type ResponseData = {
            requestId: string;
            requestAmount: number;
            requestMemo: number;
            amount: string;
            status: string;
            paymentAt: string | null,
            type: string;
            endAtNumber: number;
            qrCodePayment: {
                qrCodePaymentURL: string | null;
                bankPromptPayNo: string | null;
                bankAccountNo: string | null;
                bankCode: string | null;
                bankName: string | null;
                bankAccountNameEn: string | null;
                bankAccountNameTh: string | null;
            },
        };
    }
}