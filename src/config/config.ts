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

		PIN_ENCRYPT_BASE_URL: joi.string().required(),

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

		FEE_SYS_TRUEMONNER_NUMBER: joi.string().required(),
		FEE_SYS_E_WALLET_NUMBER: joi.string().required(),
		// FEE_SYS_RATE: joi.string().required(),

		BANK_API_AUTH_EXPIRE_MINTES: joi.number().required().positive().allow(0),
		BANK_PAYMENT_TIMEOUT_MINTES: joi.number().required().positive(),
		BANK_TOPUP_TIMEOUT_MINTES: joi.number().required().positive(),

		MIN_ACCOUNT_BALANCE_NOTIFY: joi.number().required().positive(),

		TOPUP_TO_NUMBER_LIMIT_IN_24_HOURS: joi.number().required().positive(),
		BANK_ACCOUNT_TOPUP_LIMIT_PER_DAY: joi.number().required().positive(),
		SWITCH_BANK_ACCOUNT_BALANCE_MINIMUM: joi.number().required().positive(),

		CRONJOB_RESET_BANK_ACCOUNT_SCHEDULE: joi.string().required(),
		CRONJOB_NOTIFY_BANK_ACCOUNT_SUMMARY_SCHEDULE: joi.string().required(),
		CRONJOB_NOTIFY_BANK_ACCOUNT_SUMMARY_EX_API_TOKEN: joi.string().required(),
	})
	.unknown();

const { value: envValidated, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
	throw new Error(`Environment validation error: ${error.message}`);
}

export const config = {
	env: SetEnv.toString(envValidated.NODE_ENV),
	port: SetEnv.toInteger(envValidated.PORT),
	apiPrefix: `/api/${process.env.SERVICE_NAME || 'bank-gateway'}`,
	apiPrefixInternal: `/api/${process.env.SERVICE_NAME || '_bank-gateway'}`,
	fastifyLogger: SetEnv.toBoolean(process.env.FASTIFY_LOGGER ?? true),
	appUrl: SetEnv.toString(envValidated.APP_URL),
	corsUrls: SetEnv.toString(envValidated.CORS_URLS).split(','),
	internalApiToken: SetEnv.toString(envValidated.INTERNAL_API_TOKEN),
	xssSanitizeIgnoreKeys: process.env.XSS_SANITIZE_IGNORE_KEYS || 'file,_internalSDKData',
	sentryDsn: process.env.SENTRY_DSN || '',

	PIN_ENCRYPT_BASE_URL: SetEnv.toString(envValidated.PIN_ENCRYPT_BASE_URL),

	DB_HOST: SetEnv.toString(envValidated.DB_HOST),
	DB_PORT: SetEnv.toInteger(envValidated.DB_PORT),
	DB_NAME: SetEnv.toString(envValidated.DB_NAME),
	DB_USER: SetEnv.toString(envValidated.DB_USER),
	DB_PASSWORD: SetEnv.toString(envValidated.DB_PASSWORD),

	PRIVATE_KEY_PATH: SetEnv.toString(envValidated.PRIVATE_KEY_PATH),
	PUBLIC_KEY_PATH: SetEnv.toString(envValidated.PUBLIC_KEY_PATH),

	FEE_SYS_TRUEMONNER_NUMBER: SetEnv.toString(envValidated.FEE_SYS_TRUEMONNER_NUMBER),
	FEE_SYS_E_WALLET_NUMBER: SetEnv.toString(envValidated.FEE_SYS_E_WALLET_NUMBER),
	// FEE_SYS_RATE: SetEnv.toString(envValidated.FEE_SYS_RATE),

	BANK_API_AUTH_EXPIRE_MINTES: SetEnv.toInteger(envValidated.BANK_API_AUTH_EXPIRE_MINTES),
	BANK_PAYMENT_TIMEOUT_MINTES: SetEnv.toInteger(envValidated.BANK_PAYMENT_TIMEOUT_MINTES),
	BANK_TOPUP_TIMEOUT_MINTES: SetEnv.toInteger(envValidated.BANK_TOPUP_TIMEOUT_MINTES),

	MIN_ACCOUNT_BALANCE_NOTIFY: SetEnv.toInteger(envValidated.MIN_ACCOUNT_BALANCE_NOTIFY),

	TOPUP_TO_NUMBER_LIMIT_IN_24_HOURS: SetEnv.toNumber(envValidated.TOPUP_TO_NUMBER_LIMIT_IN_24_HOURS),
	BANK_ACCOUNT_TOPUP_LIMIT_PER_DAY: SetEnv.toNumber(envValidated.BANK_ACCOUNT_TOPUP_LIMIT_PER_DAY),
	SWITCH_BANK_ACCOUNT_BALANCE_MINIMUM: SetEnv.toNumber(envValidated.SWITCH_BANK_ACCOUNT_BALANCE_MINIMUM),

	CRONJOB_RESET_BANK_ACCOUNT_SCHEDULE: SetEnv.toString(envValidated.CRONJOB_RESET_BANK_ACCOUNT_SCHEDULE),
	CRONJOB_NOTIFY_BANK_ACCOUNT_SUMMARY_SCHEDULE: SetEnv.toString(envValidated.CRONJOB_NOTIFY_BANK_ACCOUNT_SUMMARY_SCHEDULE),
	CRONJOB_NOTIFY_BANK_ACCOUNT_SUMMARY_EX_API_TOKEN: SetEnv.toString(envValidated.CRONJOB_NOTIFY_BANK_ACCOUNT_SUMMARY_EX_API_TOKEN),
};
