import { config } from '@config';
import { FastifyInstance } from 'fastify';
import baseRoute from './base/base';
import healthCheckRoute from './healthCheck/healthCheck';

import accountRoute from './account';
import accountPaymentRoute from './accountPayment';
import accountTopupRoute from './accountTopup';
import accountTransferRoute from './accountTransfer';
import lineNotifyRoute from './lineNotify';
import authRoute from './backoffice/auth';
import backOfficeUserRoute from './backoffice/user';
import backOfficeAccountTopupRoute from './backoffice/accountTopup';
import backOfficeBankAccountRoute from './backoffice/bankAccount';
import backOfficeBankAppRoute from './backoffice/bankApp';
import backOfficeFeeSysHistoryRoute from './backoffice/feeSysHistories';

const internalV1 = (_fastify: FastifyInstance) => {
	const _prefix = config.apiPrefixInternal;
};

const externalV1 = (fastify: FastifyInstance) => {
	const prefix = `${config.apiPrefix}`;
	// default external router
	fastify.register(baseRoute);
	fastify.register(healthCheckRoute, { prefix: `${prefix}/v1` });

	// external router
	fastify.register(lineNotifyRoute, { prefix: `${prefix}` });

	fastify.register(accountRoute, { prefix: `${prefix}/v1` });
	fastify.register(accountPaymentRoute, { prefix: `${prefix}/v1` });
	fastify.register(accountTransferRoute, { prefix: `${prefix}/v1` });
	fastify.register(accountTopupRoute, { prefix: `${prefix}/v1` });
};

const backofficeV1 = (fastify: FastifyInstance) => {
	const prefix = `${config.apiPrefix}/backoffice`;
	// default external router
	fastify.register(authRoute, { prefix: `${prefix}/v1` });
	fastify.register(backOfficeUserRoute, { prefix: `${prefix}/v1` });
	fastify.register(backOfficeAccountTopupRoute, { prefix: `${prefix}/v1` });
	fastify.register(backOfficeBankAccountRoute, { prefix: `${prefix}/v1` });
	fastify.register(backOfficeBankAppRoute, { prefix: `${prefix}/v1` });
	fastify.register(backOfficeFeeSysHistoryRoute, { prefix: `${prefix}/v1` });
};

export default async function router(fastify: FastifyInstance) {
	externalV1(fastify);
	internalV1(fastify);
	backofficeV1(fastify);
}
