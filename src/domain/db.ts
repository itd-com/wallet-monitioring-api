import knex, { Knex } from 'knex';
import { config } from '@config';

const knexConfig = require('../../knexfile');

export namespace Db {
	type QueryFn = (q: Knex.QueryBuilder) => Knex.QueryBuilder;

	export type ErrorDuplicate = {
		code: 'ER_DUP_ENTRY';
	};

	export type ErrorForeignKeyConstraintFails = {
		code: 'ER_ROW_IS_REFERENCED_2';
		errno: 1451;
		sqlState: '23000';
	};

	export const conn = knex(knexConfig[`${config.env}`]);

	export const isErrorDuplicate = (error): error is ErrorDuplicate => {
		return error.code === 'ER_DUP_ENTRY';
	};

	export const queryIf =
		(condition: boolean, queryFn: QueryFn) =>
		(query: Knex.QueryBuilder): Knex.QueryBuilder => {
			return condition ? queryFn(query) : query;
		};

	export const isErrorForeignKeyConstraintFails = (error): error is ErrorDuplicate => {
		return error.code === 'ER_ROW_IS_REFERENCED_2' && error.errno === 1451 && error.sqlState === '23000';
	};
}
