/**
 * @param {import("knex") knex}
 */
exports.up = (knex) => {
    return knex.schema
        .createTable('onchainTxns', (table) => {
            table.increments('id').primary();

            table.string('baseCurrency').notNullable();

            table.string('txnID').notNullable();
            table.string('value');

            table.string('networkFee');
            table.string('networkFeeUnit');

            table.string('fee');
            table.string('feeUnit');

            table.timestamp('txnAt');

            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });
};

/**
 * @param {import("knex") knex}
 */
exports.down = (knex) => {
    return knex.schema.dropTable('networkFeeAssets');
};
