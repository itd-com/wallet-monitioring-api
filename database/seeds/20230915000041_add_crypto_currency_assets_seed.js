exports.seed = async (knex) => {
      await knex('cryptoCurrencyAssets').insert([
            {
                  'baseCurrency': 'BTC_TEST',
            },
            {
                  'baseCurrency': 'ETH_TEST3',
            },
      ]);
};
