import { SwaggerOptions } from 'fastify-swagger';

export const swaggerOptions: SwaggerOptions = {
	routePrefix: `api/docs`,
	swagger: {
		info: {
			title: 'Metanet - Bank Gateway API',
			description: 'API document for MINECRAFT Core API',
			version: '0.1.0',
		},
		externalDocs: {
			url: 'https://swagger.io',
			description: 'Additional information for swagger',
		},
		schemes: ['https', 'http'],
		consumes: ['application/json'],
		produces: ['application/json'],
		securityDefinitions: {
			Authorization: {
				description: 'Authorization: "Bearer #accessToken#"',
				type: 'apiKey',
				name: 'Authorization',
				in: 'header',
			},
		},
	},
	exposeRoute: true,
};
