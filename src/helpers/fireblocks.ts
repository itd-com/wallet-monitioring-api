import { EstimatedFee } from "fireblocks-sdk/dist/src/types";

export namespace FireblocksHelper {
    export const getFeeValueByAsset = (
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

    export const getFeeUnitByAsset = (
        baseCurrency: string
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
}
