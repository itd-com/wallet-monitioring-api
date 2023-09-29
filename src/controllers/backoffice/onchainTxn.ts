import { CustomError } from '@helpers/customError';
import { Utils } from '@helpers/utils';
import { addDays } from 'date-fns';
import { FastifyReply } from 'fastify';
import { AuthUserHook } from '@hooks/authUser';
import Decimal from 'decimal.js';
import { BackOfficeOnchainTxnTransformer } from '@transformer/backoffice/onchainTxn';
import { OnchainTxnService } from '@domain/txn/services/onchainTxn';

export namespace OnchainTxnController {
    export const getOnchainTestnet = async (request: BackOfficeOnchainTxnTransformer.getOnchainTestnet.Request, reply: FastifyReply) => {
        const reqUser = AuthUserHook.getUserApi(request);

        const txnTestnet = await OnchainTxnService.getManyByCondition();

        const response: BackOfficeOnchainTxnTransformer.getOnchainTestnet.ResponseData = txnTestnet;
        return reply.code(200).send(response);
    };

}