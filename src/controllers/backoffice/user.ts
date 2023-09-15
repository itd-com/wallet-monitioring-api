/* eslint-disable no-useless-catch */
import { CustomError } from '@helpers/customError';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthUserHook } from '@hooks/authUser';
import { BackOfficeUserTransformer } from '@transformer/backoffice/user';
import { UserService } from '@domain/user/services/users';
import { User } from '@domain/user/models/users';
import { UserRoleEnum } from '@enums/userEnum';
import { OpensslHelper } from '@helpers/openssl';
import { addDays } from 'date-fns';

export namespace BackOfficeUserController {
	export const createUser = async (request: BackOfficeUserTransformer.createUser.Request, reply: FastifyReply) => {
		try {
			const reqUser = AuthUserHook.getUserApi(request);

			if (![
				UserRoleEnum.ADMIN,
				UserRoleEnum.SUPER_ADMIN,
			].includes(reqUser.role)) {
				throw new CustomError({
					statusCode: 500,
					message: `Invalid role permission getUsers.`,
				});
			}

			const {
				name,
				email,
				username,
				password,
				role,
			} = request.body;

			const newAccessTokenExpire = addDays(new Date(), 1);
			const newAccessToken = OpensslHelper.publicEncrypt(`${username}=${newAccessTokenExpire.toISOString()}`);

			const createUserId = await UserService.createOne({
				name,
				email,
				username,
				passwordEcd: OpensslHelper.publicEncrypt(password.trim()),
				role,

				accessToken: newAccessToken,
				accessTokenExpire: newAccessTokenExpire,

				apiToken: OpensslHelper.publicEncrypt(`${username}=${newAccessTokenExpire.toISOString()}`),
				apiTokenExpire: addDays(new Date(), 60),

				externalApiToken: OpensslHelper.publicEncrypt(`${username}=${newAccessTokenExpire.toISOString()}`),
				externalApiTokenExpire: addDays(new Date(), 60),
			});
			const user = await UserService.getOneByCondition({
				id: createUserId,
			});
			if (!user) {
				throw new CustomError({
					statusCode: 404,
					message: `users not found by id=${createUserId}`,
				});
			}

			const resp: BackOfficeUserTransformer.createUser.ResponseData = user;
			return reply.send(resp);
		} catch (error) {
			throw error;
		}
	};

	export const getUsers = async (request: BackOfficeUserTransformer.getUsers.Request, reply: FastifyReply) => {
		try {
			const reqUser = AuthUserHook.getUserApi(request);

			if (![
				UserRoleEnum.ADMIN,
				UserRoleEnum.ADMIN_READ_ONLY,
				UserRoleEnum.SUPER_ADMIN,
			].includes(reqUser.role)) {
				throw new CustomError({
					statusCode: 500,
					message: `Invalid role permission getUsers.`,
				});
			}

			const users = await UserService.getManyByCondition();

			const resp: BackOfficeUserTransformer.getUsers.ResponseData = users;
			return reply.send(resp);
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

			if (![
				UserRoleEnum.ADMIN,
				UserRoleEnum.ADMIN_READ_ONLY,
				UserRoleEnum.SUPER_ADMIN,
			].includes(reqUser.role)) {
				throw new CustomError({
					statusCode: 500,
					message: `Invalid role permission getUsers.`,
				});
			}

			const user = await UserService.getOneByCondition({
				id: userId,
			});
			if (!user) {
				throw new CustomError({
					statusCode: 404,
					message: `users not found by id=${userId}`,
				});
			}

			const resp: BackOfficeUserTransformer.getUserById.ResponseData = user;
			return reply.send(resp);
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
			if (role === UserRoleEnum.SUPER_ADMIN && reqUser.role !== UserRoleEnum.SUPER_ADMIN) {
				role = undefined;
			}

			const updateData = {
				name: request.body.name,
				email: request.body.email,
				username: request.body.username,
				passwordEcd,
				role,

				accessTokenExpire,

				apiTokenExpire,

				externalApiTokenExpire,
			};

			const user = await UserService.getOneByCondition({
				id: userId,
			});
			if (!user) {
				throw new CustomError({
					statusCode: 404,
					message: `users not found by id=${userId}`,
				});
			}

			const updateStatus = await UserService.updateOneById(user.id, {
				...updateData,
			});
			if (!updateStatus) {
				throw new CustomError({
					statusCode: 500,
					message: `Unable to update user by id=${userId}`,
				});
			}

			const updateUser = await UserService.getOneByCondition({
				id: userId,
			});
			if (!updateUser) {
				throw new CustomError({
					statusCode: 404,
					message: `users not found by id=${userId}`,
				});
			}

			return updateUser;
		} catch (error) {
			throw error;
		}
	};

	export const updateUserById = async (request: BackOfficeUserTransformer.updateUserById.Request, reply: FastifyReply) => {
		try {
			const reqUser = AuthUserHook.getUserApi(request);

			if (![
				UserRoleEnum.ADMIN,
				UserRoleEnum.ADMIN_READ_ONLY,
				UserRoleEnum.SUPER_ADMIN,
			].includes(reqUser.role)) {
				throw new CustomError({
					statusCode: 500,
					message: `Invalid role permission getUsers.`,
				});
			}

			const updateUser = await adminUpdateUserById(request);
			const resp: BackOfficeUserTransformer.updateUserById.ResponseData = updateUser;
			return reply.send(resp);
		} catch (error) {
			throw error;
		}
	};

}
