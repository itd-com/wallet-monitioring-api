import { BankApp } from '@domain/account/models/bankApps';
import { FastifyRequest } from 'fastify';

export namespace BackOfficeBankAppTransformer {

    export namespace getBankApps {
        export type Request = FastifyRequest;

        export type ResponseData = BankApp.T[];
    }

}