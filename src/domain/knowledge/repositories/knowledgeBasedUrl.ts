import { CustomError } from '@helpers/customError';
import { Db } from '../../db';
import { KnowledgeBasedUrl } from '../models/knowledgeBasedUrl';

export namespace KnowledgeBasedUrlRepo {
	const knowledgeBasedUrlTable = KnowledgeBasedUrl.TableName;

	export const queryOneByCondition = async (where: Partial<KnowledgeBasedUrl.T>): Promise<KnowledgeBasedUrl.T | undefined> => {
		return Db.conn(knowledgeBasedUrlTable).select().where({ ...where }).first();
	};

	export const queryManyByCondition = async (where?: Partial<KnowledgeBasedUrl.T>): Promise<KnowledgeBasedUrl.T[]> => {
		if (where) {
			return Db.conn(knowledgeBasedUrlTable)
				.select()
				.where({ ...where })
				.orderBy('createdAt', 'desc');

		}
		return Db.conn(knowledgeBasedUrlTable).select();
	};

	export const insertOne = async (data: KnowledgeBasedUrl.storeT): Promise<number> => {
		try {
			const id = await Db.conn(knowledgeBasedUrlTable)
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

}
