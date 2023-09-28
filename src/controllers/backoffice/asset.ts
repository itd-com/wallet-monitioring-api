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

        const mapTokenData = {
            "BTC_TEST": {
                tokenImgUrl: "https://trade-static.xspringdigital.com/1301/BTC.png",
                colorCode: "#F9AC53",
            },
            "ETC_TEST": {
                tokenImgUrl: "https://trade-static.xspringdigital.com/1307/ETH.png",
                colorCode: "#617EEA",
            },
            "XTZ_TEST": {
                tokenImgUrl: "https://trade-static.xspringdigital.com/1298/XTZ.png",
                colorCode: "#0063FF",
            },
            "ETH_TEST3": {
                tokenImgUrl: "https://trade-static.xspringdigital.com/1307/ETH.png",
                colorCode: "#617EEA",
            },
            "XRP_TEST": {
                tokenImgUrl: "https://s3.coinmarketcap.com/static-gravity/image/79ada5fd9cb048f799ed40d4d24c1f92.png",
                colorCode: "#23292F",
            },
            "XLM_TEST": {
                tokenImgUrl: "https://trade-static.xspringdigital.com/1258/XML.png",
                colorCode: "#999999",
            },
            "BNB_TEST": {
                tokenImgUrl: null,
                colorCode: "#F3BA2E",
            },
            "USDC_TEST3": {
                tokenImgUrl: "https://trade-static.xspringdigital.com/36683/USDC.png",
                colorCode: "#2671C4",
            },
            "BUSD_BSC_TEST": {
                tokenImgUrl: null,
                colorCode: "#F9DC9C",
            },
            "USDT_BSC_TEST": {
                tokenImgUrl: "https://trade-static.xspringdigital.com/1254/USDT.png",
                colorCode: "#1BA27A",
            },
        }

        const l = vaultAccount.assets.length;

        const assetWallets: Asset.wallet[] = vaultAccount.assets.map((v) => {
            return {
                token: v.id,
                tokenImgUrl: mapTokenData[v.id]?.tokenImgUrl ?? null,
                colorCode: mapTokenData[v.id]?.colorCode ?? '#E8E8E8',
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