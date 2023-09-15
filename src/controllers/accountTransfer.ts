/* eslint-disable no-useless-catch */
import { CustomError } from '@helpers/customError';
import { FastifyReply } from 'fastify';
import { ScbApiService } from '@domain/scbApi/services/scbApi';
import { AuthUserHook } from '@hooks/authUser';
import { AccountTransferTransformer } from '@transformer/accountTransfer';
import Decimal from 'decimal.js';

export namespace AccountTransferController {
    export const createBankTransfer = async (request: AccountTransferTransformer.createBankTransfer.Request, reply: FastifyReply) => {
        try {
            const reqUser = AuthUserHook.getUserApi(request);

            const {
                accountNo,
                bankCode,
                amount,
            } = request.body;

            if (isNaN(Number(amount))) {
                throw new CustomError({
                    statusCode: 422,
                    message: 'INVALID_AMOUNT',
                });
            }

            const dAmount = new Decimal(amount);
            const aNetAmount = `${dAmount.toFixed(2)}`;
            const transactions = await ScbApiService.createBankTransfer(
                reqUser,
                {
                    accountNo,
                    bankCode,
                    amount: Number(aNetAmount),
                },
            );

            const resp: AccountTransferTransformer.createBankTransfer.ResponseData = transactions;
            return reply.send(resp);
        } catch (error) {
            throw error;
        }
    };

}
