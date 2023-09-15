import { CustomError } from '@helpers/customError';
import { Utils } from '@helpers/utils';
import { addDays } from 'date-fns';
import { FastifyReply } from 'fastify';
import { UserService } from '@domain/user/services/users';
import { OpensslHelper } from '@helpers/openssl';
import { AuthUserHook } from '@hooks/authUser';
import { BackOfficeNetworkFeeTransformer } from '@transformer/backoffice/networkFee';
import { NetworkFeeAssetService } from '@domain/networkFee/services/networkFeeAssets';

export namespace NetworkFeeController {
    export const getCurrent = async (request: BackOfficeNetworkFeeTransformer.getCurrent.Request, reply: FastifyReply) => {
        const reqUser = AuthUserHook.getUserApi(request);

        const {
            currency,
            sortBy,
            dateFrom,
            dateTo,
        } = request.query;

        const networkFeeAssets = await NetworkFeeAssetService.getManyByFilter(
            {
                currency: currency != 'ALL' ? currency : undefined,
                sortBy: sortBy ?? 'DESC',
                dateFrom,
                dateTo,
            },
        );
        if (!networkFeeAssets) {
            throw new CustomError({
                statusCode: 404,
                message: `NETWORK_FEE_NOT_FOUND`,
            });
        }

        const response: BackOfficeNetworkFeeTransformer.getCurrent.ResponseData = networkFeeAssets;
        return reply.code(200).send(response);
    };

    export const getSchedule = async (request: BackOfficeNetworkFeeTransformer.getCurrent.Request, reply: FastifyReply) => {
        const reqUser = AuthUserHook.getUserApi(request);

        const {
            currency,
            sortBy,
            dateFrom,
            dateTo,
        } = request.query;

        const networkFeeAssets = await NetworkFeeAssetService.getManyByFilter(
            {
                currency: currency != 'ALL' ? currency : undefined,
                sortBy: sortBy ?? 'DESC',
                dateFrom,
                dateTo,
            },
        );
        if (!networkFeeAssets) {
            throw new CustomError({
                statusCode: 404,
                message: `NETWORK_FEE_NOT_FOUND`,
            });
        }

        const response: BackOfficeNetworkFeeTransformer.getCurrent.ResponseData = networkFeeAssets;
        return reply.code(200).send(response);
    };

}