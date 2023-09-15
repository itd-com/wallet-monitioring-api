import { response } from './_default';
const tags = ['Backoffice BankApp'];

export namespace BackOfficeBankAppSchema {

    export const getBankApps = {
        description: 'getBankApps API',
        tags,
        summary: 'getBankApps API',
        response: {
            401: response['401'],
            404: response['404'],
            409: response['409'],
            422: response['422'],
            500: response['500'],
        },
    };

}
