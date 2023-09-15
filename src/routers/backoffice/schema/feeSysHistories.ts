import { response } from './_default';
const tags = ['Backoffice FeeSysHistory'];

export namespace BackOfficeFeeSysHistorySchema {

    export const getFeeSysHistorise = {
        description: 'getFeeSysHistorise API',
        tags,
        summary: 'getFeeSysHistorise API',
        response: {
            401: response['401'],
            404: response['404'],
            409: response['409'],
            422: response['422'],
            500: response['500'],
        },
    };

}
