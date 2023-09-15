import { FeeSysHistory } from '@domain/feeSys/models/feeSysHistories';
import { FastifyRequest } from 'fastify';

export namespace BackOfficeFeeSysHistoryTransformer {

    export namespace getFeeSysHistorise {
        export type Request = FastifyRequest;

        export type ResponseData = FeeSysHistory.T[];
    }

}