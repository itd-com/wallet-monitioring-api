import { TopupTypeEnum } from '@enums/topupEnum';
import { response } from './_default';

const tags = ['AccountTopup'];

export namespace AccountTopupSchema {
    export const createAccountTopup = {
        description: 'createAccountTopup API',
        tags,
        summary: 'createAccountTopup API.',
        body: {
            type: 'object',
            required: ['type', 'toNumber', 'amount'],
            properties: {
                type: {
                    type: 'string',
                    example: TopupTypeEnum.TRUEMONEY,
                    enum: [TopupTypeEnum.TRUEMONEY, TopupTypeEnum.E_WALLET],
                },
                toNumber: {
                    type: 'string',
                    example: '0952914822',
                },
                amount: {
                    type: 'string',
                    example: '100.00',
                },
                note: {
                    type: ['string'],
                    example: 'note',
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
