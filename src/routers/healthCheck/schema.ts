const tags = ['Health Check'];

export namespace HealthCheckSchema {
	export const index = {
		summary: 'Health Check',
		description: 'Health Check',
		tags,
		response: {
			200: {
				description: 'Successful Response',
				type: 'object',
				properties: {
					result: { type: 'string' },
				},
			},
		},
	};
}
