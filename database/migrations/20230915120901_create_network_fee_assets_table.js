/**
 * @param {import("knex") knex}
 */
exports.up = (knex) => {
    return knex.schema
        .createTable('networkFeeAssets', (table) => {
            table.increments('id').primary();

            table.string('baseCurrency').notNullable();

            table.string('unit').notNullable();
            table.string('feeLow');
            table.json('feeLowResponse');
            table.string('feeMedium');
            table.json('feeMediumResponse');
            table.string('feeHigh');
            table.json('feeHighResponse');

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
