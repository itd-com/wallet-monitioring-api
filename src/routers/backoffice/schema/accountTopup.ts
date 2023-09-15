import { response } from './_default';
const tags = ['Backoffice AccountTopup'];

export namespace BackOfficeAccountTopupSchema {
    export const getAccountTopup = {
        description: 'getAccountTopup API',
        tags,
        summary: 'getAccountTopup API',
        response: {
            401: response['401'],
            404: response['404'],
            409: response['409'],
            422: response['422'],
            500: response['500'],
        },
    };
}
