const cron = require('node-cron');
import { config } from '@config/config';
import { NetworkFeeAssetService } from '@domain/networkFee/services/networkFeeAssets';
import { format, utcToZonedTime } from 'date-fns-tz';

const CRONJOB_RESET_BANK_ACCOUNT_SCHEDULE = config.CRONJOB_FETCH_NETWORK_FEE_SCHEDULE;

export interface EstimatedFee {
    networkFee?: string;
    gasPrice?: string;
    feePerByte?: string;
    baseFee?: string;
    priorityFee?: string;
}

export interface EstimateFeeResponse {
    low: EstimatedFee;
    medium: EstimatedFee;
    high: EstimatedFee;
}

export interface AssetNetworkFee {
    id: string;
    baseCurrency: string;
    imgUrl: string;
    fee: EstimateFeeResponse;
    updatedAt: Date | string;
}

const getFeeValueByAsset = (
    baseCurrency: string,
    fee: EstimatedFee
): { value: string } => {
    if (baseCurrency === "BTC_TEST") {
        return {
            value: fee?.feePerByte || "undefined",
        };
    }
    if (baseCurrency === "ETH_TEST3") {
        return {
            value: fee?.priorityFee || "undefined",
        };
    }

    return {
        value: "undefined",
    };
};

const getFeeUnitByAsset = (
    baseCurrency: string,
    fee: EstimatedFee
): { unit: string } => {
    if (baseCurrency === "BTC_TEST") {
        return {
            unit: "SAT/BYTE",
        };
    }
    if (baseCurrency === "ETH_TEST3") {
        return {
            unit: "GWEI",
        };
    }

    return {
        unit: "undefined",
    };
};

const cronFetcNetworkFeeSchedule = cron.schedule(CRONJOB_RESET_BANK_ACCOUNT_SCHEDULE, async () => {
    const now = new Date();
    const startAt = format(utcToZonedTime(now, 'Asia/Bangkok'), 'yyyy-MM-dd HH:mm:ss (O)');
    console.log(`RUN:cronFetcNetworkFeeSchedule: ${startAt}`);

    await NetworkFeeAssetService.createOne({
        baseCurrency: '',
        unit: '',
        feeLow: '',
        feeLowResponse: '',
        feeMedium: '',
        feeMediumResponse: '',
        feeHigh: '',
        feeHighResponse: '',
    });
});


console.log("cronJob start!!!");
cronFetcNetworkFeeSchedule.start();