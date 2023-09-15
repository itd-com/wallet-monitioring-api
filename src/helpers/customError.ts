import { ErrorValidationKey } from '../enums/errorEnum';

/* eslint-disable @typescript-eslint/ban-types */
export type CustomErrorParams = {
	message: string;
	code?: string;
	statusCode: number;
	data?: object;
};

export class CustomError extends Error {
	statusCode?: number;
	data?: object;
	code?: string;

	constructor(params: CustomErrorParams) {
		super(params.message);

		this.name = 'CustomError';
		this.message = params.message;
		this.statusCode = params.statusCode;
		this.data = params.data;
		this.code = params.code;
	}
}

export const customError = (params: CustomErrorParams) => {
	throw new CustomError(params);
};

export const customValidationError = (error: Error & { validation: any }) => {
	let param: string;
	const errorMessage = {};
	error.validation.forEach((item) => {
		if (item.message === ErrorValidationKey.REQUIRED && item.dataPath.length === 0) {
			param = item.params.errors[0].params.missingProperty;
		} else {
			param = item.dataPath.replace('/', '');
		}
		const message = item.message.replace(/"/g, '');
		// const message = item.message.replaceAll('"', '');

		if (errorMessage[param]) {
			const prepareArray = [message];
			if (typeof errorMessage[param] === 'string') {
				errorMessage[param] = [errorMessage[param]].concat(prepareArray);
			} else {
				errorMessage[param] = errorMessage[param].concat(prepareArray);
			}

			return;
		}
		errorMessage[param] = message;
	});

	throw new CustomError({
		message: 'Validation Error',
		statusCode: 422,
		data: errorMessage,
	});
};
