import { response } from '../../schema/_default';
const tags = ['Backoffice Auth'];

export namespace AuthSchema {

    export const getMe = {
        description: 'getMe API',
        tags,
        summary: 'getMe API',
        response: {
            200: {
                description: 'Successful Response',
                type: 'object',
                properties: {
                    id: { type: 'number', example: 1 },
                    serviceName: { type: 'string', example: 'iamta.info.com' },

                    name: { type: 'string', example: 'Ta Developer' },
                    email: { type: 'string', example: 'iamta.dev@gmail.com' },
                    username: { type: 'string', example: 'iamta.dev' },
                    passwordEcd: { type: 'string', example: 'XGaOefguBVwl....Q8lXI0zxsJ0Fsb' },
                    role: { type: 'string', example: 'MEMBER' },

                    // User Auth
                    accessToken: { type: 'string', example: 'XGaOefguBVwl....Q8lXI0zxsJ0Fsb' },
                    accessTokenExpire: { type: 'string', example: '2023-09-26 03:28:57' },

                    apiToken: { type: 'string', example: 'XGaOefguBVwl....Q8lXI0zxsJ0Fsb' },
                    apiTokenExpire: { type: 'string', example: '2023-09-26 03:28:57' },

                    externalApiToken: { type: 'string', example: 'XGaOefguBVwl....Q8lXI0zxsJ0Fsb' },
                    externalApiTokenExpire: { type: 'string', example: '2023-09-26 03:28:57' },

                    createdAt: { type: 'string', example: '2023-09-26 03:28:57' },
                    updatedAt: { type: 'string', example: '2023-09-26 03:28:57' }
                },
            },
            401: response['401'],
            404: response['404'],
            409: response['409'],
            422: response['422'],
            500: response['500'],
        },
    };

    export const login = {
        description: 'Login API',
        tags,
        summary: 'Login API',
        body: {
            type: 'object',
            required: ['username', 'password'],
            properties: {
                username: {
                    type: 'string',
                    example: 'ta004',
                },
                password: {
                    type: 'string',
                    example: 'Test1234!',
                },
            },
        },
        response: {
            200: {
                description: 'Successful Response',
                type: 'object',
                properties: {
                    id: { type: 'number', example: 1 },
                    serviceName: { type: 'string', example: 'iamta.info.com' },

                    name: { type: 'string', example: 'Ta Developer' },
                    email: { type: 'string', example: 'iamta.dev@gmail.com' },
                    username: { type: 'string', example: 'iamta.dev' },
                    // passwordEcd: { type: 'string', example: 'XGaOefguBVwl....Q8lXI0zxsJ0Fsb' },
                    role: { type: 'string', example: 'MEMBER' },

                    // User Auth
                    accessToken: { type: 'string', example: 'XGaOefguBVwl....Q8lXI0zxsJ0Fsb' },
                    accessTokenExpire: { type: 'string', example: '2023-09-26 03:28:57' },

                    // apiToken: { type: 'string', example: 'XGaOefguBVwl....Q8lXI0zxsJ0Fsb' },
                    // apiTokenExpire: { type: 'string', example: '2023-09-26 03:28:57' },

                    // externalApiToken: { type: 'string', example: 'XGaOefguBVwl....Q8lXI0zxsJ0Fsb' },
                    // externalApiTokenExpire: { type: 'string', example: '2023-09-26 03:28:57' },

                    createdAt: { type: 'string', example: '2023-09-26 03:28:57' },
                    updatedAt: { type: 'string', example: '2023-09-26 03:28:57' }
                },
            },
            401: response['401'],
            404: response['404'],
            409: response['409'],
            422: response['422'],
            500: response['500'],
        },
    };
}
