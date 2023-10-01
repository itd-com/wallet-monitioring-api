import { KnowledgeBasedUrl } from '../models/knowledgeBasedUrl';
import { KnowledgeBasedUrlRepo } from '../repositories/knowledgeBasedUrl';

export namespace KnowledgeBasedUrlService {
	export const getOneByCondition = async (where: Partial<KnowledgeBasedUrl.T>): Promise<KnowledgeBasedUrl.T | undefined> => {
		return KnowledgeBasedUrlRepo.queryOneByCondition(where);
	};

	export const getManyByCondition = async (where?: Partial<KnowledgeBasedUrl.T>): Promise<KnowledgeBasedUrl.T[]> => {
		return KnowledgeBasedUrlRepo.queryManyByCondition(where);
	};

	export const createOne = async (data: KnowledgeBasedUrl.storeT): Promise<number> => {
		return KnowledgeBasedUrlRepo.insertOne(data);
	};

	export const updateOneById = async (id: number, data: KnowledgeBasedUrl.updateT): Promise<number> => {
		return KnowledgeBasedUrlRepo.updateOneById(id, data);
	};

	export const deleteOneById = async (id: number): Promise<number> => {
		return KnowledgeBasedUrlRepo.deleteOneById(id);
	};
}
