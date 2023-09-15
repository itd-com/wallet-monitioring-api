import { response } from './_default';

const tags = ['AccountTransfer'];

export namespace AccountTransferSchema {
    export const createBankTransfer = {
        description: 'createBankTransfer API',
        tags,
        summary: 'createBankTransfer API.',
        body: {
            type: 'object',
            required: ['accountNo', 'bankCode', 'amount'],
            properties: {
                accountNo: {
                    type: 'string',
                    example: '7072738704',
                },
                bankCode: {
                    type: 'string',
                    example: '006', // https://th.wikipedia.org/wiki/รายชื่อธนาคารในประเทศไทย
                },
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
}
