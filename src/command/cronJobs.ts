const cron = require('node-cron');
import { config } from '@config/config';
import { FireblocksService } from '@domain/fireblocks/services/fireblocks';
import { NetworkFeeAsset } from '@domain/networkFee/models/networkFeeAssets';
import { NetworkFeeAssetService } from '@domain/networkFee/services/networkFeeAssets';
import { FireblocksHelper } from '@helpers/fireblocks';
import { format, utcToZonedTime } from 'date-fns-tz';

const CRONJOB_RESET_BANK_ACCOUNT_SCHEDULE = config.CRONJOB_FETCH_NETWORK_FEE_SCHEDULE;

const coins = ['BTC_TEST', 'ETH_TEST3'];

for (const c of coins) {
    const cronFetcNetworkFeeSchedule = cron.schedule(CRONJOB_RESET_BANK_ACCOUNT_SCHEDULE, async () => {
        const now = new Date();
        const startAt = format(utcToZonedTime(now, 'Asia/Bangkok'), 'yyyy-MM-dd HH:mm:ss (O)');
        console.log(`RUN:${c}:FetcNetworkFee: ${startAt}`);

        const newSdk = await FireblocksService.auth();
        const currencyFee = await FireblocksService.getFeeForAsset(newSdk, c);
        console.log({
            baseCurrency: c,
            currencyFee,
        });

        const createdId = await NetworkFeeAssetService.createOne({
            baseCurrency: c,
            unit: FireblocksHelper.getFeeUnitByAsset(c).unit,
            feeLow: FireblocksHelper.getFeeValueByAsset(c, currencyFee.low).value,
            feeLowResponse: JSON.stringify(currencyFee.low),
            feeMedium: FireblocksHelper.getFeeValueByAsset(c, currencyFee.medium).value,
            feeMediumResponse: JSON.stringify(currencyFee.medium),
            feeHigh: FireblocksHelper.getFeeValueByAsset(c, currencyFee.high).value,
            feeHighResponse: JSON.stringify(currencyFee.high),
        });

        console.log('insert:', createdId);

    });

    cronFetcNetworkFeeSchedule.start();
}


console.log("cronJob start!!!");
