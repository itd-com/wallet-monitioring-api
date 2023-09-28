import { CustomError } from '@helpers/customError';
import { Utils } from '@helpers/utils';
import { addDays } from 'date-fns';
import { FastifyReply } from 'fastify';
import { AuthUserHook } from '@hooks/authUser';
import { BackOfficeNetworkFeeTransformer } from '@transformer/backoffice/networkFee';
import { NetworkFeeAssetService } from '@domain/networkFee/services/networkFeeAssets';
import { BackOfficeAssetTransformer } from '@transformer/backoffice/asset';
import { FireblocksService } from '@domain/fireblocks/services/fireblocks';
import { Asset } from '@domain/asset/models/asset';
import Decimal from 'decimal.js';

export namespace AssetController {
    export const getWallet = async (request: BackOfficeAssetTransformer.getWallet.Request, reply: FastifyReply) => {
        const reqUser = AuthUserHook.getUserApi(request);

        const {
            vaultAccountId
        } = request.query;

        const newSdk = await FireblocksService.auth();
        const vaultAccount = await FireblocksService.getVaultAccountById(newSdk, vaultAccountId);

        if (!vaultAccount.assets) {
            throw new CustomError({
                statusCode: 404,
                message: `ASSETS_NOT_FOUND`,
            });
        }

        const imageList = {
            "BTC_TEST": "https://trade-static.xspringdigital.com/1301/BTC.png",
            "ETC_TEST": "https://trade-static.xspringdigital.com/1307/ETH.png",
            "XTZ_TEST": "https://trade-static.xspringdigital.com/1298/XTZ.png",
            "ETH_TEST3": "https://trade-static.xspringdigital.com/1307/ETH.png",
            "XRP_TEST": null,
            "XLM_TEST": "https://trade-static.xspringdigital.com/1258/XML.png",
            "BNB_TEST": null,
            "USDC_TEST3": "https://trade-static.xspringdigital.com/36683/USDC.png",
            "BUSD_BSC_TEST": null,
            "USDT_BSC_TEST": "https://trade-static.xspringdigital.com/1254/USDT.png",
        }

        const l = vaultAccount.assets.length;

        const assetWallets: Asset.wallet[] = vaultAccount.assets.map((v) => {
            return {
                token: v.id,
                tokenImgUrl: imageList[v.id] ?? null,
                fireblock: v.available ?? '0.00',
                apg: '0.00',
                binance: '0.00',
                falconX: '0.00',
                total: '100000',
                ratio: new Decimal(1).div(new Decimal(l)).times(new Decimal(100)).toFixed(2),
            }
        })

        const response: BackOfficeAssetTransformer.getWallet.ResponseData = assetWallets;
        return reply.code(200).send(response);
    };

}