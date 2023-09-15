export namespace Utils {
	export const isDefined = <T>(value: T | undefined): value is T => value !== undefined;

	export const isNullOrUndefined = <T>(value: T | undefined | null): value is undefined | null => value === undefined || value === null;

	export const isEmptyString = (input: string | null | undefined): boolean => {
		return input === undefined || input === null || input === '';
	};

	export const isEmptyArr = (input: any[]) => {
		return !input.length;
	};

	export const isValidJSONString = (value: string): boolean => {
		try {
			JSON.parse(value);
			return true;
		} catch (error) {
			return false;
		}
	};

	export const convertJsonString = (jsonString: string): any | undefined => {
		try {
			return JSON.parse(jsonString);
		} catch (error) {
			return undefined;
		}
	};

	export const deleteProperties = <T, K extends keyof T>(obj: T, props: K[]): Omit<T, K> => {
		const newObj = { ...obj };
		for (const prop of props) {
			delete newObj[prop];
		}
		return newObj as Omit<T, K>;
	};

	export const randomValueArray = <T>(array: T[]): T | undefined => {
		const randomIndexLength = array.length;
		if (randomIndexLength == 0) {
			return undefined;
		}
		const randomIndex = Math.floor(Math.random() * randomIndexLength);
		return array[randomIndex];
	}

	export const genToken = (): string => {
		var rand = function () {
			return `${Math.random().toString(36)}`.substring(2); // remove `0.`
		};

		return rand() + rand() + rand(); // to make it longer
	}

}
