/**
 * @param {import("knex") knex}
 */
exports.up = (knex) => {
    return knex.schema
        .createTable('bankApps', (table) => {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.string('serviceName').notNullable();

            table.text('bankDeviceIdEcd', 'longtext').notNullable();
            table.text('bankPinEcd', 'longtext').notNullable();
            table.text('bankApiAuthRefreshEcd', 'longtext').notNullable();
            table.text('bankApiAuthEcd', 'longtext').notNullable();
            table.datetime('bankApiAuthExpire').notNullable();

            table.string('feePaymentRate').notNullable().defaultTo('0.00');
            table.string('feeTopupRate').notNullable().defaultTo('0.00');
            table.string('feeBankTransferRate').notNullable().defaultTo('0.00');

            table.boolean('enableServiceQrPayment').notNullable().defaultTo(1);
            table.boolean('enableServiceTopup').notNullable().defaultTo(1);
            table.boolean('enableServiceBankTransfer').notNullable().defaultTo(1);

            table.text('notifyToken1', 'longtext');
            table.text('notifyToken2', 'longtext');

            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });
};

/**
 * @param {import("knex") knex}
 */
exports.down = (knex) => {
    return knex.schema.dropTable('bankApps');
};
