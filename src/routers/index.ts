import { config } from '@config';
import { FastifyInstance } from 'fastify';
import baseRoute from './base/base';
import healthCheckRoute from './healthCheck/healthCheck';

import authRoute from './backoffice/auth';
import backOfficeUserRoute from './backoffice/user';

const internalV1 = (_fastify: FastifyInstance) => {
	const _prefix = `${config.apiPrefixInternal}`;
};

const externalV1 = (fastify: FastifyInstance) => {
	const prefix = `${config.apiPrefix}`;
	// default external router
	fastify.register(baseRoute);
	fastify.register(healthCheckRoute, { prefix: `${prefix}/v1` });
};

const backofficeV1 = (fastify: FastifyInstance) => {
	const prefix = `${config.apiPrefix}/backoffice`;
	// default external router
	fastify.register(authRoute, { prefix: `${prefix}/v1` });
	fastify.register(backOfficeUserRoute, { prefix: `${prefix}/v1` });
};

export default async function router(fastify: FastifyInstance) {
	externalV1(fastify);
	internalV1(fastify);
	backofficeV1(fastify);
}
