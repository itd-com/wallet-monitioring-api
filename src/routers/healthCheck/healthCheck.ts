import { FastifyInstance } from 'fastify';
import { HealthCheckController } from './controller';
import { HealthCheckSchema } from './schema';

const healthCheckRoute = async (app: FastifyInstance) => {
	app.get(
		'/healthcheck',
		{
			schema: HealthCheckSchema.index,
		},
		HealthCheckController.index,
	);
};

export default healthCheckRoute;
