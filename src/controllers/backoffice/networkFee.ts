import { CustomError } from '@helpers/customError';
import { Utils } from '@helpers/utils';
import { addDays } from 'date-fns';
import { FastifyReply } from 'fastify';
import { UserService } from '@domain/user/services/users';
import { OpensslHelper } from '@helpers/openssl';
import { AuthUserHook } from '@hooks/authUser';
import { BackOfficeNetworkFeeTransformer } from '@transformer/backoffice/networkFee';
import { NetworkFeeAssetService } from '@domain/networkFee/services/networkFeeAssets';
import { FireblocksService } from '@domain/fireblocks/services/fireblocks';
import { FireblocksHelper } from '@helpers/fireblocks';
import { NetworkFeeAsset } from '@domain/networkFee/models/networkFeeAssets';

export namespace NetworkFeeController {
    export const getCurrent = async (request: BackOfficeNetworkFeeTransformer.getCurrent.Request, reply: FastifyReply) => {
        const reqUser = AuthUserHook.getUserApi(request);

        const {
            currency,
            // sortBy,
            // dateFrom,
            // dateTo,
        } = request.query;

        let coins = [
            'BTC_TEST',
            'ETH_TEST3',
            'BNB_TEST',
            'XLM_TEST',
            'XRP_TEST',
            'XTZ_TEST',
        ];
        if (currency !== 'ALL') {
            coins = coins.filter((v) => v === currency);
        }
        const networkFeeAssets: NetworkFeeAsset.viewT[] = [];
        const newSdk = await FireblocksService.auth();

        for (const c of coins) {
            const currencyFee = await FireblocksService.getFeeForAsset(newSdk, c);

            networkFeeAssets.push({
                baseCurrency: c,
                unit: FireblocksHelper.getFeeUnitByAsset(c).unit,
                feeLow: FireblocksHelper.getFeeValueByAsset(c, currencyFee.low).value,
                feeLowResponse: JSON.stringify(currencyFee.low),
                feeMedium: FireblocksHelper.getFeeValueByAsset(c, currencyFee.medium).value,
                feeMediumResponse: JSON.stringify(currencyFee.medium),
                feeHigh: FireblocksHelper.getFeeValueByAsset(c, currencyFee.high).value,
                feeHighResponse: JSON.stringify(currencyFee.high),
                createdAt: new Date(),
                updatedAt: new Date(),
            })
        }

        const response: BackOfficeNetworkFeeTransformer.getCurrent.ResponseData = networkFeeAssets;
        return reply.code(200).send(response);
    };

    export const getSchedule = async (request: BackOfficeNetworkFeeTransformer.getSchedule.Request, reply: FastifyReply) => {
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
                sortBy: sortBy ?? 'desc',
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

        const response: BackOfficeNetworkFeeTransformer.getSchedule.ResponseData = networkFeeAssets;
        return reply.code(200).send(response);
    };



}