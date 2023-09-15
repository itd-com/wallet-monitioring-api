import { CommonValidator } from '@hooks/common';
import { FastifyInstance } from 'fastify';
import { AccountSchema } from './schema/account';
import { AuthBankAppHook } from '@hooks/authBankApp';
import { AccountController } from '@controllers/account';
import { AuthUserHook } from '@hooks/authUser';

const accountRoute = async (app: FastifyInstance) => {
	app.get(
		'/account/transactions',
		{
			schema: AccountSchema.getAccountTransactions,
			preHandler: [
				CommonValidator.postValidator,
				AuthUserHook.verifyApiTokenExpired,
				AuthBankAppHook.login,
			],
		},
		AccountController.getAccountTransactions,
	);

	app.get(
		'/account/summary',
		{
			schema: AccountSchema.getAccountSummary,
			preHandler: [
				CommonValidator.postValidator,
				AuthUserHook.verifyApiTokenExpired,
				AuthBankAppHook.login,
			],
		},
		AccountController.getAccountSummary,
	);
};

export default accountRoute;
