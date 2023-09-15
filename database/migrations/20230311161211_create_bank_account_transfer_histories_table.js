/**
 * @param {import("knex") knex}
 */
exports.up = (knex) => {
    return knex.schema
        .createTable('bankAccountTransferHistories', (table) => {
            table.increments('id').primary();
            table.string('requestId').notNullable();
            table.string('serviceName');
            table.integer('bankAppId').unsigned().notNullable();
            table.integer('bankAccountId').unsigned().notNullable();

            table.enum('transferType', ['TRANSFER_IN', 'TRANSFER_OUT']).notNullable();
            table.enum('status', ['IN_PROGRESS', 'PENDING', 'SUCCESS', 'ERROR', 'TIMEOUT', 'REJECT']).notNullable();

            table.string('amount').notNullable();
            table.string('fee');
            table.string('netAmount');

            table.integer('feeSysId').unsigned();
            table.string('feeSysTxnBatch');

            table.string('action');
            table.string('payerId');
            table.string('payerNo');
            table.string('payeeId');
            table.string('payeeNo');

            table.datetime('startAt');
            table.datetime('txnAt');
            table.datetime('endAt');

            table.json('data');
            table.string('thirdPartRequestId');
            table.json('thirdPartRequestData');
            table.json('thirdPartResponseData');
            table.json('thirdPartWebHookData');
            table.string('remark');

            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));

            // foreign
            table.foreign('bankAppId').references('id').inTable('bankApps');
            table.foreign('bankAccountId').references('id').inTable('bankAccounts');

            table.foreign('feeSysId').references('id').inTable('feeSysHistories');
        });
};

/**
 * @param {import("knex") knex}
 */
exports.down = (knex) => {
    return knex.schema.dropTable('bankTransferHistories');
};
