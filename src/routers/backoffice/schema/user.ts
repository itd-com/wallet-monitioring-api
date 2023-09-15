import { response } from './_default';

const tags = ['Backoffice User'];

export namespace BackOfficeUserSchema {
    export const createUser = {
        description: 'createUser API',
        tags,
        summary: 'createUser API',
        body: {
            type: 'object',
            required: [
                'serviceName',
                'name',
                'email',
                'username',
                'password',
                'role',
            ],
            properties: {
                name: { type: 'string', example: 'name' },
                email: { type: 'string', example: 'email' },
                username: { type: 'string', example: 'username' },
                password: { type: 'string', example: 'password' },
                role: { type: 'string', example: 'role' },
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

    export const getUsers = {
        description: 'getUsers API',
        tags,
        summary: 'getUsers API',
        response: {
            401: response['401'],
            404: response['404'],
            409: response['409'],
            422: response['422'],
            500: response['500'],
        },
    };

    export const getUserById = {
        description: 'getUserById API',
        tags,
        summary: 'getUserById API',
        response: {
            401: response['401'],
            404: response['404'],
            409: response['409'],
            422: response['422'],
            500: response['500'],
        },
    };

    export const updateUserById = {
        description: 'updateUserById API',
        tags,
        summary: 'updateUserById API',
        response: {
            401: response['401'],
            404: response['404'],
            409: response['409'],
            422: response['422'],
            500: response['500'],
        },
    };
}
