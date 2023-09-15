import { FastifyReply, FastifyRequest } from 'fastify';

export namespace HealthCheckController {
	export const index = async (request: FastifyRequest, reply: FastifyReply) => {
		return reply.code(200).send({ result: 'OK' });
	};
}
