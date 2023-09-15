import dotenv from 'dotenv';
import joi from 'joi';

dotenv.config();

namespace SetEnv {
	export const toString = (v: any): string => `${v}`;
	export const toInteger = (v: any): number => {
		if (isNaN(Number(v))) {
			return 0;
		}
		return parseInt(v, 10);
	};
	export const toNumber = (v: any): number => {
		if (isNaN(Number(v))) {
			return 0;
		}
		return Number(v);
	};
	export const toBoolean = (v: any): boolean => {
		if (typeof v === 'boolean') {
			return v;
		}
		if (v === 'true') {
			return true;
		}
		return false;
	};
}

const envVarsSchema = joi
	.object()
	.keys({
		/**
		 * APP Config Validation
		 */
		NODE_ENV: joi.string().required().valid('localhost', 'test', 'dev', 'uat', 'prod'),
		PORT: joi.number().required().positive(),
		APP_URL: joi.string().required(),
		CORS_URLS: joi.string().required(),
		INTERNAL_API_TOKEN: joi.string().required(),

		/**
		 * DB Config Validation
		 */
		DB_HOST: joi.string().required(),
		DB_PORT: joi.number().required().positive(),
		DB_NAME: joi.string().required(),
		DB_USER: joi.string().required(),
		// DB_PASSWORD: joi.string().required(),

		PRIVATE_KEY_PATH: joi.string().required(),
		PUBLIC_KEY_PATH: joi.string().required(),

		CRONJOB_FETCH_NETWORK_FEE_SCHEDULE: joi.string().required(),
	})
	.unknown();

const { value: envValidated, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
	throw new Error(`Environment validation error: ${error.message}`);
}

export const config = {
	env: SetEnv.toString(envValidated.NODE_ENV),
	port: SetEnv.toInteger(envValidated.PORT),
	apiPrefix: `/api/${process.env.SERVICE_NAME || 'wm'}`,
	apiPrefixInternal: `/api/${process.env.SERVICE_NAME || '_wm'}`,
	fastifyLogger: SetEnv.toBoolean(process.env.FASTIFY_LOGGER ?? true),
	appUrl: SetEnv.toString(envValidated.APP_URL),
	corsUrls: SetEnv.toString(envValidated.CORS_URLS).split(','),
	internalApiToken: SetEnv.toString(envValidated.INTERNAL_API_TOKEN),
	xssSanitizeIgnoreKeys: process.env.XSS_SANITIZE_IGNORE_KEYS || 'file,_internalSDKData',
	sentryDsn: process.env.SENTRY_DSN || '',

	DB_HOST: SetEnv.toString(envValidated.DB_HOST),
	DB_PORT: SetEnv.toInteger(envValidated.DB_PORT),
	DB_NAME: SetEnv.toString(envValidated.DB_NAME),
	DB_USER: SetEnv.toString(envValidated.DB_USER),
	DB_PASSWORD: SetEnv.toString(envValidated.DB_PASSWORD),

	fireblocks: {
		endpoint: process.env.FIREBLOCKS_ENDPOINT || '',
		apiKey: process.env.FIREBLOCKS_API_KEY || '',
		secretKeyPath: process.env.FIREBLOCKS_SECRET_KEY_PATH || '',
		mainVaultId: process.env.FIREBLOCKS_MAIN_VAULT_ID || '',
		operatingVaultId: process.env.FIREBLOCKS_OPERATING_VAULT_ID || '',
		coldWalletId: process.env.FIREBLOCKS_COLD_WALLET_ID || '',
		omnibusCoinbaseExchangeId: process.env.FIREBLOCKS_OMNIBUS_COINBASE_EXCHANGE_ID || '',
		webhookPublicKey: process.env.FIREBLOCKS_WEBHOOK_PUBLIC_KEY?.replace(/\\n/g, '\n') || '',
	},

	PRIVATE_KEY_PATH: SetEnv.toString(envValidated.PRIVATE_KEY_PATH),
	PUBLIC_KEY_PATH: SetEnv.toString(envValidated.PUBLIC_KEY_PATH),

	CRONJOB_FETCH_NETWORK_FEE_SCHEDULE: SetEnv.toString(envValidated.CRONJOB_FETCH_NETWORK_FEE_SCHEDULE),

};
