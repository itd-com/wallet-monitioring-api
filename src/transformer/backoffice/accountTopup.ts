import { TopupHistory } from '@domain/topup/models/topupHistories';
import { TopupTypeEnum } from '@enums/topupEnum';
import { FastifyRequest } from 'fastify';

export namespace BackOfficeUserAccountTopupTransformer {
    export namespace getAccountTopup {
        export type Request = FastifyRequest;

        export type ResponseData = TopupHistory.T[];
    }
}