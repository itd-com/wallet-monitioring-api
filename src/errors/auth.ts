import { CustomErrorParams } from '@helpers/customError';

export const NoAuthorizationHeader: CustomErrorParams = {
	message: 'Authorization header is missing',
	statusCode: 401,
};

export const BadRequestAuthorization: CustomErrorParams = {
	message: 'Format is Authorization: Bearer [token]',
	statusCode: 401,
};

export const AuthorizationTokenExpired: CustomErrorParams = {
	message: 'Authorization Token is expired',
	statusCode: 401,
};

export const AuthorizationTokenInvalid: CustomErrorParams = {
	message: 'Authorization Token is invalid',
	statusCode: 401,
};

export const AuthorizationTokenNotFound: CustomErrorParams = {
	message: 'Authorization Token not found',
	statusCode: 401,
};

export const Unauthorized: CustomErrorParams = {
	message: 'Unauthorized',
	statusCode: 401,
};

export const AccountNotFound: CustomErrorParams = {
	message: 'Account not found',
	statusCode: 404,
};
