import { CustomErrorParams } from '@helpers/customError';

export const DuplicateEntry: CustomErrorParams = {
	message: 'Duplicate Entry',
	statusCode: 409,
};

export const InternalServalError: CustomErrorParams = {
	message: 'Internal Server Error',
	statusCode: 500,
};

export const NotFound: CustomErrorParams = {
	message: 'Not Found',
	statusCode: 404,
};

export const Conflict: CustomErrorParams = {
	message: 'Conflict',
	statusCode: 409,
};

export default {
	DuplicateEntry,
	InternalServalError,
	NotFound,
};
