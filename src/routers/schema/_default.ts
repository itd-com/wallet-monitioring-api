export const response = {
	401: {
		description: 'Authorization failed',
		type: 'object',
		properties: {
			error: {
				type: 'object',
				properties: {
					message: { type: 'string' },
					code: { type: 'string' },
				},
			},
		},
	},
	404: {
		description: 'Error Not Found',
		type: 'object',
		properties: {
			error: {
				type: 'object',
				properties: {
					message: { type: 'string' },
					code: { type: 'string' },
				},
			},
		},
	},
	409: {
		description: 'Error Duplicate entry',
		type: 'object',
		properties: {
			error: {
				type: 'object',
				properties: {
					message: { type: 'string' },
					code: { type: 'string' },
				},
			},
		},
	},
	422: {
		description: 'Error validation failed',
		type: 'object',
		properties: {
			error: {
				type: 'object',
				properties: {
					message: { type: 'string' },
					messageTh: { type: 'string' },
					code: { type: 'string' },
					data: {
						// type: 'object', // bug response
						example: 'object | keyError -> locale.target.key.for.translate',
					},
				},
			},
		},
	},
	500: {
		description: 'Internal Server Error',
		type: 'object',
		properties: {
			error: {
				type: 'object',
				properties: {
					message: { type: 'string' },
					code: { type: 'string' },
				},
			},
		},
	},
	503: {
		description: 'Service Error',
		type: 'object',
		properties: {
			error: {
				type: 'object',
				properties: {
					message: { type: 'string' },
					code: { type: 'string' },
				},
			},
		},
	},
};
