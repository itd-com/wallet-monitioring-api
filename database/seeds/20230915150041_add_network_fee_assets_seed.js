exports.seed = async (knex) => {
      await knex('networkFeeAssets').insert([
            {
                  "baseCurrency": "BTC_TEST",
                  "unit": "SAT\/BYTE",
                  "feeLow": "10",
                  "feeLowResponse": null,
                  "feeMedium": "20",
                  "feeMediumResponse": null,
                  "feeHigh": "30",
                  "feeHighResponse": null,
            },
            {
                  "baseCurrency": "BTC_TEST",
                  "unit": "SAT\/BYTE",
                  "feeLow": "11",
                  "feeLowResponse": null,
                  "feeMedium": "25",
                  "feeMediumResponse": null,
                  "feeHigh": "45",
                  "feeHighResponse": null,
            },
            {
                  "baseCurrency": "ETH_TEST3",
                  "unit": "GWEI",
                  "feeLow": "1.1",
                  "feeLowResponse": null,
                  "feeMedium": "1.2",
                  "feeMediumResponse": null,
                  "feeHigh": "1.3",
                  "feeHighResponse": null,
            },
            {
                  "baseCurrency": "ETH_TEST3",
                  "unit": "GWEI",
                  "feeLow": "1.3",
                  "feeLowResponse": null,
                  "feeMedium": "1.7",
                  "feeMediumResponse": null,
                  "feeHigh": "2.0001",
                  "feeHighResponse": null,
            }
      ]);
};
