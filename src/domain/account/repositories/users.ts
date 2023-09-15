import { CustomError } from '@helpers/customError';
import { Db } from '../../db';
import { User } from '../models/users';

export namespace UserRepo {
	const usersTable = User.TableName;

	export const queryOneByCondition = async (where: Partial<User.T>): Promise<User.T | undefined> => {
		return Db.conn(usersTable).select().where({ ...where }).first();
	};

	export const queryManyByCondition = async (where?: Partial<User.T>): Promise<User.T[]> => {
		if (where) {
			return Db.conn(usersTable)
				.select()
				.where({ ...where });
		}
		return Db.conn(usersTable).select();
	};

	export const insertOne = async (data: User.storeT): Promise<number> => {
		try {
			const id = await Db.conn(usersTable)
				.insert(data)
				.then((rows) => {
					return rows[0];
				});

			return id;
		} catch (error) {
			if (error.code === 'ER_DUP_ENTRY') {
				throw new CustomError({
					statusCode: 422,
					message: error.code,
				});
			}
			throw new CustomError({
				statusCode: 500,
				message: error.message,
			});
		}
	};

	export const updateOneById = async (id: number, data: User.updateT) => {
		return Db.conn(usersTable).where({ id }).update(data);
	};

	export const deleteOneById = async (id: number) => {
		return Db.conn(usersTable).where({ id }).delete();
	};
}
