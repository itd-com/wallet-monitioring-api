// https://github.com/leizongmin/js-xss
import { FilterXSS } from 'xss';
import { config } from '@config';

const xssWithCustomRules = new FilterXSS({
	stripIgnoreTagBody: true,
});

/**
 * filter out xss attacks from value
 * @param {object | string} data
 * @param {object[]} visitedObjects
 * @return {object | string}
 */
const filterXss = (data: any, visitedObjects: any[] = []) => {
	if (!data || Buffer.isBuffer(data)) {
		// null, undefined, 0
		return data;
	}

	const isVisited = (current: any) => {
		if (Array.isArray(current) || typeof current !== 'object') {
			return false;
		}

		if (visitedObjects.includes(current)) {
			return true;
		}

		visitedObjects.push(current);
		return false;
	};

	const isSkipped = (key: string) => {
		const ignoreKeys = config.xssSanitizeIgnoreKeys?.trim().split(',') || [];
		return ignoreKeys.includes(key);
	};

	const typeOfData = typeof data;

	if (Array.isArray(data)) {
		return data.map((obj) => filterXss(obj, visitedObjects));
	} else if (typeOfData === 'object') {
		return Object.keys(data).reduce((acc, key) => {
			const value = data[key];
			const skippedOrVisited = [isSkipped(key), isVisited(value)].some((v) => v);

			return {
				...acc,
				[key]: skippedOrVisited ? value : filterXss(value, visitedObjects), // case nested object will call recursive function
			};
		}, {});
	} else if (typeOfData === 'string') {
		return xssWithCustomRules.process(data);
	}

	return data;
};

export const escapeHtmlString = (data: string): string => {
	return data.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
};

export const objFilterXss = (data: any, keys?: string[] | undefined): any => {
	if (typeof data !== 'object') return undefined;
	const newData = {};
	const objKeys = Object.keys(data);
	objKeys.forEach((key) => {
		const validString = typeof data[key] === 'string';
		if ((keys || objKeys).includes(key) && validString) {
			newData[key] = escapeHtmlString(data[key]);
		} else if (validString) {
			newData[key] = data[key];
		}
	});
	return newData;
};

export default filterXss;
