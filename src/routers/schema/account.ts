import { response } from './_default';

const tags = ['Account'];

export namespace AccountSchema {
	export const getAccountTransactions = {
		description: 'getAccountTransactions API',
		tags,
		summary: 'getAccountTransactions API.',
		querystring: {
			type: 'object',
			required: ['startAt', 'endAt'],
			properties: {
				startAt: {
					type: 'string',
					example: '2023-06-25T00:00:00.000+07:00',
				},
				endAt: {
					type: 'string',
					example: '2023-06-26T00:00:00.000+07:00!',
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
	export const getAccountSummary = {
		description: 'getAccountSummary API',
		tags,
		summary: 'getAccountSummary API.',
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
