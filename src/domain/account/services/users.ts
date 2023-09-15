import { User } from '../models/users';
import { UserRepo } from '../repositories/users';

export namespace UserService {
	export const getOneByCondition = async (where: Partial<User.T>): Promise<User.T | undefined> => {
		return UserRepo.queryOneByCondition(where);
	};

	export const getManyByCondition = async (where?: Partial<User.T>): Promise<User.T[]> => {
		return UserRepo.queryManyByCondition(where);
	};

	export const createOne = async (data: User.storeT): Promise<number> => {
		return UserRepo.insertOne(data);
	};

	export const updateOneById = async (id: number, data: User.updateT) => {
		return UserRepo.updateOneById(id, data);
	};

	export const deleteOneById = async (id: number) => {
		return UserRepo.deleteOneById(id);
	};
}
