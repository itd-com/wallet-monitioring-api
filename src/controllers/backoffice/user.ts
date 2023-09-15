/* eslint-disable no-useless-catch */
import { CustomError } from '@helpers/customError';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthUserHook } from '@hooks/authUser';
import { BackOfficeUserTransformer } from '@transformer/backoffice/user';
import { UserService } from '@domain/account/services/users';
import { User } from '@domain/account/models/users';
import { UserRoleEnum } from '@enums/userEnum';
import { OpensslHelper } from '@helpers/openssl';
import { addDays } from 'date-fns';
import { Utils } from '@helpers/utils';

export namespace BackOfficeUserController {
	export const createUser = async (request: BackOfficeUserTransformer.createUser.Request, reply: FastifyReply) => {
		try {
			const reqUser = AuthUserHook.getUserApi(request);

			const {
				name,
				serviceName,
				email,
				username,
				password,
				role,
			} = request.body;

			switch (reqUser.role) {
				case UserRoleEnum.MY_APP:
				case UserRoleEnum.CUSTOMER:
					if (![UserRoleEnum.MY_APP, UserRoleEnum.CUSTOMER, UserRoleEnum.CUSTOMER_READ_ONLY].includes(role)) {
						throw new CustomError({
							statusCode: 422,
							message: `Invalid role.`,
						})
					}
				case UserRoleEnum.ADMIN:
					if (![
						UserRoleEnum.MY_APP,
						UserRoleEnum.CUSTOMER,
						UserRoleEnum.CUSTOMER_READ_ONLY,
						UserRoleEnum.ADMIN,
						UserRoleEnum.ADMIN_READ_ONLY
					].includes(role)) {
						throw new CustomError({
							statusCode: 422,
							message: `Invalid role.`,
						})
					}
					break;
				case UserRoleEnum.SUPER_ADMIN:
					break;

				default:
					throw new CustomError({
						statusCode: 500,
						message: `Invalid role permission getUsers.`,
					})
			}

			var createUserId = await UserService.createOne({
				name,
				serviceName,
				email,
				username,
				passwordEcd: OpensslHelper.publicEncrypt(password.trim()),
				role,

				accessToken: OpensslHelper.publicEncrypt(username),
				accessTokenExpire: addDays(new Date(), 60),

				apiToken: OpensslHelper.publicEncrypt(email),
				apiTokenExpire: addDays(new Date(), 60),

				externalApiToken: Utils.genToken(),
				externalApiTokenExpire: addDays(new Date(), 60),
			});
			var user = await UserService.getOneByCondition({
				id: createUserId,
			});
			if (!user) {
				throw new CustomError({
					statusCode: 404,
					message: `users not found by id=${createUserId}`,
				})
			}

			var resp: BackOfficeUserTransformer.createUser.ResponseData = user;
			return reply.send(resp);



		} catch (error) {
			throw error;
		}
	};

	export const getUsers = async (request: BackOfficeUserTransformer.getUsers.Request, reply: FastifyReply) => {
		try {
			const reqUser = AuthUserHook.getUserApi(request);

			switch (reqUser.role) {
				case UserRoleEnum.MY_APP:
				case UserRoleEnum.CUSTOMER:
				case UserRoleEnum.CUSTOMER_READ_ONLY:
					var users = await UserService.getManyByCondition({
						serviceName: reqUser.serviceName,
					});

					var resp: BackOfficeUserTransformer.getUsers.ResponseData = users;
					return reply.send(resp);

				case UserRoleEnum.ADMIN:
				case UserRoleEnum.ADMIN_READ_ONLY:
				case UserRoleEnum.SUPER_ADMIN:
					var users = await UserService.getManyByCondition();

					var resp: BackOfficeUserTransformer.getUsers.ResponseData = users;
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

	export const getUserById = async (request: BackOfficeUserTransformer.getUserById.Request, reply: FastifyReply) => {
		try {
			const {
				userId,
			} = request.params;

			const reqUser = AuthUserHook.getUserApi(request);

			switch (reqUser.role) {
				case UserRoleEnum.MY_APP:
				case UserRoleEnum.CUSTOMER:
				case UserRoleEnum.CUSTOMER_READ_ONLY:
					var user = await UserService.getOneByCondition({
						id: userId,
						serviceName: reqUser.serviceName,
					});
					if (!user) {
						throw new CustomError({
							statusCode: 404,
							message: `users not found by id=${userId}`,
						})
					}

					var resp: BackOfficeUserTransformer.getUserById.ResponseData = user;
					return reply.send(resp);

				case UserRoleEnum.ADMIN:
				case UserRoleEnum.ADMIN_READ_ONLY:
				case UserRoleEnum.SUPER_ADMIN:
					var user = await UserService.getOneByCondition({
						id: userId,
					});
					if (!user) {
						throw new CustomError({
							statusCode: 404,
							message: `users not found by id=${userId}`,
						})
					}

					var resp: BackOfficeUserTransformer.getUserById.ResponseData = user;
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

	const memberUpdateUserById = async (request: BackOfficeUserTransformer.updateUserById.Request): Promise<User.T> => {
		try {
			const reqUser = AuthUserHook.getUserApi(request);

			const {
				userId,
			} = request.params;

			const accessTokenExpire = request.body.accessTokenExpire ? new Date(request.body.accessTokenExpire) : undefined;
			const apiTokenExpire = request.body.apiTokenExpire ? new Date(request.body.apiTokenExpire) : undefined;
			const externalApiTokenExpire = request.body.externalApiTokenExpire ? new Date(request.body.externalApiTokenExpire) : undefined;

			const passwordEcd = request.body.password ? OpensslHelper.publicEncrypt(request.body.password.trim()) : undefined;

			const updateData = {
				serviceName: request.body.serviceName,

				name: request.body.name,
				email: request.body.email,
				username: request.body.username,
				passwordEcd,
				// role: request.body.role,

				accessToken: request.body.accessToken,
				// accessTokenExpire,

				apiToken: request.body.apiToken,
				// apiTokenExpire,

				externalApiToken: request.body.externalApiToken,
				// externalApiTokenExpire,
			};

			const user = await UserService.getOneByCondition({
				id: userId,
				serviceName: reqUser.serviceName,
			});
			if (!user) {
				throw new CustomError({
					statusCode: 404,
					message: `users not found by id=${userId}`,
				})
			}

			const updateStatus = await UserService.updateOneById(user.id, {
				...updateData
			});
			if (!updateStatus) {
				throw new CustomError({
					statusCode: 500,
					message: `Unable to update user by id=${userId}`,
				})
			}

			const updateUser = await UserService.getOneByCondition({
				id: userId,
			});
			if (!updateUser) {
				throw new CustomError({
					statusCode: 404,
					message: `users not found by id=${userId}`,
				})
			}

			return updateUser;
		} catch (error) {
			throw error;
		}
	};

	const adminUpdateUserById = async (request: BackOfficeUserTransformer.updateUserById.Request): Promise<User.T> => {
		try {
			const reqUser = AuthUserHook.getUserApi(request);

			const {
				userId,
			} = request.params;

			const accessTokenExpire = request.body.accessTokenExpire ? new Date(request.body.accessTokenExpire) : undefined;
			const apiTokenExpire = request.body.apiTokenExpire ? new Date(request.body.apiTokenExpire) : undefined;
			const externalApiTokenExpire = request.body.externalApiTokenExpire ? new Date(request.body.externalApiTokenExpire) : undefined;

			const passwordEcd = request.body.password ? OpensslHelper.publicEncrypt(request.body.password.trim()) : undefined;

			let role = request.body.role;
			if (role == UserRoleEnum.SUPER_ADMIN && reqUser.role !== UserRoleEnum.SUPER_ADMIN) {
				role = undefined;
			}

			const updateData = {
				serviceName: request.body.serviceName,

				name: request.body.name,
				email: request.body.email,
				username: request.body.username,
				passwordEcd,
				role,

				accessToken: request.body.accessToken,
				accessTokenExpire,

				apiToken: request.body.apiToken,
				apiTokenExpire,

				externalApiToken: request.body.externalApiToken,
				externalApiTokenExpire,
			};

			const user = await UserService.getOneByCondition({
				id: userId,
			});
			if (!user) {
				throw new CustomError({
					statusCode: 404,
					message: `users not found by id=${userId}`,
				})
			}

			const updateStatus = await UserService.updateOneById(user.id, {
				...updateData
			});
			if (!updateStatus) {
				throw new CustomError({
					statusCode: 500,
					message: `Unable to update user by id=${userId}`,
				})
			}

			const updateUser = await UserService.getOneByCondition({
				id: userId,
			});
			if (!updateUser) {
				throw new CustomError({
					statusCode: 404,
					message: `users not found by id=${userId}`,
				})
			}

			return updateUser;
		} catch (error) {
			throw error;
		}
	};

	export const updateUserById = async (request: BackOfficeUserTransformer.updateUserById.Request, reply: FastifyReply) => {
		try {
			const reqUser = AuthUserHook.getUserApi(request);

			switch (reqUser.role) {
				case UserRoleEnum.MY_APP:
				case UserRoleEnum.CUSTOMER:
					var updateUser = await memberUpdateUserById(request);
					var resp: BackOfficeUserTransformer.updateUserById.ResponseData = updateUser;
					return reply.send(resp);

				case UserRoleEnum.ADMIN:
				case UserRoleEnum.SUPER_ADMIN:
					var updateUser = await adminUpdateUserById(request);
					var resp: BackOfficeUserTransformer.updateUserById.ResponseData = updateUser;
					return reply.send(resp);

				default:
					break;
			}

			throw new CustomError({
				statusCode: 500,
				message: `Invalid role permission updateUserById.`,
			})

		} catch (error) {
			throw error;
		}
	};

}
