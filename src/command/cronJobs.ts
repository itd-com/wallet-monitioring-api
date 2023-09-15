const cron = require('node-cron');
import { config } from '@config/config';
import { FireblocksService } from '@domain/fireblocks/services/fireblocks';
import { NetworkFeeAsset } from '@domain/networkFee/models/networkFeeAssets';
import { NetworkFeeAssetService } from '@domain/networkFee/services/networkFeeAssets';
import { FireblocksHelper } from '@helpers/fireblocks';
import { Utils } from '@helpers/utils';
import { format, utcToZonedTime } from 'date-fns-tz';

const CRONJOB_RESET_BANK_ACCOUNT_SCHEDULE = config.CRONJOB_FETCH_NETWORK_FEE_SCHEDULE;

const coins = [
    'BTC_TEST',
    'ETH_TEST3',
    'BNB_TEST',
    'XLM_TEST',
    'XRP_TEST',
    'XTZ_TEST',
];

for (const c of coins) {
    const cronFetcNetworkFeeSchedule = cron.schedule(CRONJOB_RESET_BANK_ACCOUNT_SCHEDULE, async () => {
        const now = new Date();
        const startAt = format(utcToZonedTime(now, 'Asia/Bangkok'), 'yyyy-MM-dd HH:mm:ss (O)');
        console.log(`RUN:${c}:FetcNetworkFee: ${startAt}`);
        try {
            const newSdk = FireblocksService.auth();
            const currencyFee = await FireblocksService.getFeeForAsset(newSdk, c);
            console.log({
                baseCurrency: c,
                currencyFee,
            });

            await NetworkFeeAssetService.createOne({
                baseCurrency: c,
                unit: FireblocksHelper.getFeeUnitByAsset(c).unit,
                feeLow: FireblocksHelper.getFeeValueByAsset(c, currencyFee.low).value,
                feeLowResponse: Utils.isValidJSON(currencyFee.low) ? JSON.stringify(currencyFee.low) : null,
                feeMedium: FireblocksHelper.getFeeValueByAsset(c, currencyFee.medium).value,
                feeMediumResponse: Utils.isValidJSON(currencyFee.medium) ? JSON.stringify(currencyFee.medium) : null,
                feeHigh: FireblocksHelper.getFeeValueByAsset(c, currencyFee.high).value,
                feeHighResponse: Utils.isValidJSON(currencyFee.high) ? JSON.stringify(currencyFee.high) : null,
            });

        } catch (error) {
            console.log(error);
        }






    });

    cronFetcNetworkFeeSchedule.start();
}


console.log("cronJob start!!!");
