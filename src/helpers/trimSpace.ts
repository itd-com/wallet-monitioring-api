import { config } from '@config';

/**
 * filter out space from value (start & end)
 * @param {object | string | any[]} data
 * @param {object[]} visitedObjects
 * @return {object | string}
 */
const trimSpace = (data: any, visitedObjects: any[] = []) => {
	if (!data || Buffer.isBuffer(data)) {
		// null, undefined, 0
		return data;
	}

	// avoid endless loop from circular object reference case
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

	// workaround to avoid infinite recursion for file content
	const isSkipped = (key: string) => {
		const ignoreKeys = config.xssSanitizeIgnoreKeys?.trim().split(',') || [];
		return ignoreKeys.includes(key);
	};

	const typeOfData = typeof data;
	if (Array.isArray(data)) {
		return data.map((obj) => trimSpace(obj, visitedObjects));
	} else if (typeOfData === 'object') {
		return Object.keys(data).reduce((acc, key) => {
			const value = data[key];
			const skippedOrVisited = [isSkipped(key), isVisited(value)].some((v) => v);

			return {
				...acc,
				[key]: skippedOrVisited ? value : trimSpace(value),
			};
		}, {});
	} else if (typeOfData === 'string') {
		return data.trim();
	}

	return data;
};

export default trimSpace;
