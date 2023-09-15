import { customValidationError } from '@helpers/customError';
import { FastifyRequest } from 'fastify';

export namespace CommonValidator {
	export const postValidator = async (request: FastifyRequest): Promise<void> => {
		if (request.validationError) {
			customValidationError(request.validationError);
		}
	};
}
