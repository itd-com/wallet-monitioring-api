/* eslint-disable no-useless-catch */
import { CustomError } from '@helpers/customError';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthUserHook } from '@hooks/authUser';
import { BackOfficeBankAppTransformer } from '@transformer/backoffice/bankApp';
import { UserRoleEnum } from '@enums/userEnum';
import { BankAppService } from '@domain/account/services/bankApps';

export namespace BackOfficeBankAppController {
	export const getBankApps = async (request: BackOfficeBankAppTransformer.getBankApps.Request, reply: FastifyReply) => {
		try {
			const reqUser = AuthUserHook.getUserApi(request);

			switch (reqUser.role) {
				case UserRoleEnum.MY_APP:
				case UserRoleEnum.CUSTOMER:
				case UserRoleEnum.CUSTOMER_READ_ONLY:
					var bankApps = await BankAppService.getManyByCondition({
						serviceName: reqUser.serviceName,
					});

					var resp: BackOfficeBankAppTransformer.getBankApps.ResponseData = bankApps;
					return reply.send(resp);

				case UserRoleEnum.ADMIN:
				case UserRoleEnum.ADMIN_READ_ONLY:
				case UserRoleEnum.SUPER_ADMIN:
					var bankApps = await BankAppService.getManyByCondition();

					var resp: BackOfficeBankAppTransformer.getBankApps.ResponseData = bankApps;
					return reply.send(resp);

				default:
					break;
			}

			throw new CustomError({
				statusCode: 500,
				message: `Invalid role permission getUsers.`,
			})
		} catch (error) {
			throw error;
		}
	};

}
