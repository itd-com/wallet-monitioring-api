import { response } from './_default';

const tags = ['AccountPayment'];

export namespace AccountPaymentSchema {
    export const createQrPayment = {
        description: 'createQrPayment API',
        tags,
        summary: 'createQrPayment API.',
        body: {
            type: 'object',
            required: ['amount'],
            properties: {
                amount: {
                    type: 'string',
                    example: '10',
                },
            },
        },
        response: {
            401: response['401'],
            404: response['404'],
            409: response['409'],
            422: response['422'],
            500: response['500'],
            503: response['503'],
        },
    };

    export const getQrPaymentByRequestId = {
        description: 'getQrPaymentByRequestId API',
        tags,
        summary: 'getQrPaymentByRequestId API.',
        params: {
            type: 'object',
            required: ['requestId'],
            properties: {
                requestId: {
                    type: 'string',
                    example: '24000f8e-3475-49aa-b307-2e646f594004',
                },
            },
        },
        response: {
            401: response['401'],
            404: response['404'],
            409: response['409'],
            422: response['422'],
            500: response['500'],
            503: response['503'],
        },
    };
}
