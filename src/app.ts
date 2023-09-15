import { config, swaggerOptions } from '@config';
import router from '@routers';
import Ajv from 'ajv';
import AjvErrors from 'ajv-errors';
import fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import fastifyHelmet from 'fastify-helmet';
import fastifyMultipart from 'fastify-multipart';
import swagger from 'fastify-swagger';
import secureJson from 'secure-json-parse';
import { NotFoundError, NotFoundErrorView } from './errors/notFound';
import { CustomError } from './helpers/customError';
import logger from './helpers/logger';
import sanitizeXSS from './helpers/sanitizeXSS';
import trimSpace from './helpers/trimSpace';
import { User } from '@domain/user/models/users';

declare module 'fastify' {
	interface FastifyRequest {
		userApi?: User.apiT;
		locals: Record<string, any>;
	}
}

export const initApp = () => {
	const isDevEnvironment = config.env !== 'prod';

	const app = fastify({
		trustProxy: true,
		logger: config.env !== 'test' ? config.fastifyLogger : undefined,
		pluginTimeout: 20000,
	});

	// Multipart
	app.register(fastifyMultipart, {
		limits: {
			fileSize: 20_000_000,
			files: 1,
		},
		attachFieldsToBody: true,
	});

	const ajv = new Ajv({
		schemaId: 'auto',
		removeAdditional: true,
		useDefaults: true,
		coerceTypes: false,
		allErrors: true,
		$data: true,
		jsonPointers: true,
	});

	ajv.addKeyword('isFileType', {
		compile: (schema: any, parent: any, it: any) => {
			parent.type = 'file';
			delete parent.isFileType;
			return () => true;
		},
	});

	AjvErrors(ajv);

	app.setValidatorCompiler(({ schema }) => {
		return ajv.compile(schema);
	});

	// Swagger
	if (isDevEnvironment) {
		app.register(swagger, swaggerOptions);
	}

	app.register(fastifyCors, {
		origin: config.corsUrls.length === 1 ? config.corsUrls[0] : config.corsUrls,
		credentials: true,
		methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
	});

	app.register(fastifyHelmet, { contentSecurityPolicy: false });

	// Router
	app.register(router);

	app.addContentTypeParser('application/json', { parseAs: 'string' }, (req, body, done) => {
		try {
			const json = secureJson.parse(body.toString());
			done(null, json);
		} catch (err) {
			err.statusCode = 499; // special case for check JSON parser error
			done(err, undefined);
		}
	});

	app.setErrorHandler((error, _request, reply) => {
		console.error('APP ERROR', error);
		if (error instanceof TypeError) {
			console.log('[[Fatal]]', error);
		}
		if (error instanceof NotFoundError) {
			reply.status(404).send(NotFoundErrorView);
			return;
		}
		const customError: CustomError = error;
		const isClientError = customError.statusCode !== undefined && Math.floor(customError.statusCode / 100) === 4;

		if (config.sentryDsn && !isClientError) {
			logger.captureException(error);
		}

		if (customError.statusCode === 499 && !isDevEnvironment) {
			// error code 499 is special code just for checking the JSON parser error
			reply.status(400).send({ error: { message: 'Invalid input' } });
			return;
		}
		// prettier-ignore
		const errorResponse =
			isClientError || customError.statusCode == 503 || isDevEnvironment
				? {
					data: customError.data,
					code: customError.code,
					message: customError.message,
				}
				: {
					code: customError.statusCode,
					message: 'Internal Server Error',
				};

		reply.status(customError.statusCode || 500).send({
			error: errorResponse,
		});
	});

	app.addHook('preValidation', (request: any, _, done) => {
		request.query = sanitizeXSS(request.query);
		request.body = sanitizeXSS(request.body);
		request.params = sanitizeXSS(request.params);

		request.body = trimSpace(request.body);

		done();
	});

	return app;
};
