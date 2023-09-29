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
}
