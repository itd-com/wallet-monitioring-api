/**
 * @param {import("knex") knex}
 */
exports.up = (knex) => {
    return knex.schema
        .createTable('feeSysHistories', (table) => {
            table.increments('id').primary();
            table.string('requestId').notNullable();
            table.string('serviceName');
            table.integer('bankAppId').unsigned().notNullable();

            table.enum('transferType', ['TRANSFER_IN', 'TRANSFER_OUT']).notNullable();
            table.enum('status', ['IN_PROGRESS', 'PENDING', 'SUCCESS', 'ERROR', 'TIMEOUT', 'REJECT']).notNullable();

            table.string('amount').notNullable();
            table.string('fee');
            table.string('netAmount');

            table.string('action');
            table.string('payerId');
            table.string('payerNo');
            table.string('payeeId');
            table.string('payeeNo');

            table.datetime('txnAt');
            table.string('txnBatch').notNullable();

            table.string('remark');

            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));

            // foreign
            table.foreign('bankAppId').references('id').inTable('bankApps');
        });
};

/**
 * @param {import("knex") knex}
 */
exports.down = (knex) => {
    return knex.schema.dropTable('feeSysHistories');
};
