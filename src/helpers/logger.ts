import * as Sentry from '@sentry/node';
import pino from 'pino';
import { config } from '../config/config';

Sentry.init({
	dsn: config.sentryDsn,
	environment: config.env,
});

const consoleLogger = pino({
	enabled: config.fastifyLogger,
});

Error.stackTraceLimit = 100;

export default Sentry;

export namespace Log {
	export const error = (err: Error, extra?: any) => {
		console.trace(err);
		// prettier-ignore
		Sentry.captureException(
			err,
			extra
				? {
					extra,
				}
				: undefined,
		);
		consoleLogger.error(err);
	};

	export const info = (message: string, data?: any | undefined) => {
		consoleLogger.info({ msg: message, ...data });
	};
}
