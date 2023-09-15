import { response } from './_default';
const tags = ['Backoffice BankAccount'];

export namespace BackOfficeBankAccountSchema {
    export const createBankAccount = {
        description: 'createBankAccount API',
        tags,
        summary: 'createBankAccount API',
        body: {
            type: 'object',
            required: [
                'name',
                'serviceName',
                'bankAppId',

                'enableServiceQrPayment',
                'enableServiceTopup',
                'enableServiceBankTransfer',

                'bankAccountNo',
                'bankAccountNoView',
                'bankPromptPayNo',
                'bankAccountNameTh',
                'bankAccountNameEn',
                'bankBranchName',
            ],
            properties: {
                name: { type: 'string', example: 'name' },
                serviceName: { type: 'string', example: 'serviceName' },
                bankAppId: { type: 'number', example: 0 },

                enableServiceQrPayment: { type: 'boolean', example: false },
                enableServiceTopup: { type: 'boolean', example: false },
                enableServiceBankTransfer: { type: 'boolean', example: false },

                bankAccountNo: { type: 'string', example: 'bankAccountNo' },
                bankAccountNoView: { type: 'string', example: 'bankAccountNoView' },
                bankPromptPayNo: { type: ['string', 'null'], example: null },
                bankAccountNameTh: { type: 'string', example: 'bankAccountNameTh' },
                bankAccountNameEn: { type: 'string', example: 'bankAccountNameEn' },
                bankBranchName: { type: ['string', 'null'], example: null },
            },
        },
        response: {
            401: response['401'],
            404: response['404'],
            409: response['409'],
            422: response['422'],
            500: response['500'],
        },
    };

    export const getBankAccounts = {
        description: 'getBankAccounts API',
        tags,
        summary: 'getBankAccounts API',
        response: {
            401: response['401'],
            404: response['404'],
            409: response['409'],
            422: response['422'],
            500: response['500'],
        },
    };

    export const getBankAccountById = {
        description: 'getBankAccountById API',
        tags,
        summary: 'getBankAccountById API',
        response: {
            401: response['401'],
            404: response['404'],
            409: response['409'],
            422: response['422'],
            500: response['500'],
        },
    };

    export const updateBankAccountById = {
        description: 'updateBankAccountById API',
        tags,
        summary: 'updateBankAccountById API',
        response: {
            401: response['401'],
            404: response['404'],
            409: response['409'],
            422: response['422'],
            500: response['500'],
        },
    };
}
