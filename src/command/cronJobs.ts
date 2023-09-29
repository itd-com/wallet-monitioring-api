const cron = require('node-cron');
import { config } from '@config/config';
import { FireblocksService } from '@domain/fireblocks/services/fireblocks';
import { NetworkFeeAsset } from '@domain/networkFee/models/networkFeeAssets';
import { NetworkFeeAssetService } from '@domain/networkFee/services/networkFeeAssets';
import { OnchainTxnService } from '@domain/txn/services/onchainTxn';
import { FireblocksHelper } from '@helpers/fireblocks';
import { Utils } from '@helpers/utils';
import { format, utcToZonedTime } from 'date-fns-tz';
import Decimal from 'decimal.js';

const CRONJOB_RESET_BANK_ACCOUNT_SCHEDULE = config.CRONJOB_FETCH_NETWORK_FEE_SCHEDULE;
const CRONJOB_FETC_TXN_MEMPOOL_SCHEDULE = config.CRONJOB_FETC_TXN_MEMPOOL_SCHEDULE;
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

const cronFetcTxnMempoolSchedule = cron.schedule(CRONJOB_FETC_TXN_MEMPOOL_SCHEDULE, async () => {
    const now = new Date();
    const startAt = format(utcToZonedTime(now, 'Asia/Bangkok'), 'yyyy-MM-dd HH:mm:ss (O)');
    console.log(`RUN:BTC_TEST:FetcTxnMempool: ${startAt}`);
    try {
        const response = await fetch('https://blockstream.info/testnet/api/mempool/recent');
        const data = await response.json();

        if (data && data.length > 0) {
            for (const transaction of data) {
                const txid = transaction.txid;

                const find = await OnchainTxnService.getOneByCondition({
                    txnID: txid,
                })

                if (!find) {
                    const value = new Decimal(`${transaction.value}`).div(new Decimal(1e8));
                    const size = transaction.vsize;
                    const fee = transaction.fee;
                    const feeRateSat = new Decimal(`${fee}`).div(new Decimal(size));
                    const feeRate = feeRateSat.div(new Decimal(1e8));

                    await OnchainTxnService.createOne({
                        baseCurrency: 'BTC_TEST',
                        txnID: `${txid}`,
                        value: new Decimal(value).toFixed(),
                        networkFee: new Decimal(feeRateSat).toFixed(1),
                        networkFeeUnit: 'sat/vB',
                        txnAt: new Date(),
                        fee: new Decimal(feeRate).toFixed(),
                        feeUnit: 'BTC_TEST'
                    });
                }

            }
        }

    } catch (error) {
        console.log(error);
    }

});

cronFetcTxnMempoolSchedule.start();


console.log("cronJob start!!!");
