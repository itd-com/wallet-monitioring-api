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
        if (baseCurrency === "BNB_TEST") {
            return {
                value: fee?.gasPrice || "undefined",
            };
        }
        if (baseCurrency === "XLM_TEST") {
            return {
                value: fee?.networkFee || "undefined",
            };
        }
        if (baseCurrency === "XLM_TEST") {
            return {
                value: fee?.networkFee || "undefined",
            };
        }
        if (baseCurrency === "XTZ_TEST") {
            return {
                value: fee?.networkFee || "undefined",
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
        if (baseCurrency === "BNB_TEST") {
            return {
                unit: "GWEI",
            };
        }
        if (baseCurrency === "XLM_TEST") {
            return {
                unit: "XLM_TEST",
            };
        }
        if (baseCurrency === "XRP_TEST") {
            return {
                unit: "XRP_TEST",
            };
        }
        if (baseCurrency === "XTZ_TEST") {
            return {
                unit: "XTZ_TEST",
            };
        }

        return {
            unit: "undefined",
        };
    };
}
