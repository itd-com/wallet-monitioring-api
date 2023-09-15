/**
 * @param {import("knex") knex}
 */
exports.up = (knex) => {
    return knex.schema
        .createTable('bankAccounts', (table) => {
            table.increments('id').primary();
            table.string('name').unique().notNullable();
            table.string('serviceName');
            table.integer('bankAppId').unsigned().notNullable();

            table.decimal('bankAccountBalance', 12, 2).notNullable().defaultTo(0);
            table.decimal('todayTopUpTruemoneyBalance', 12, 2).notNullable().defaultTo(0);
            
            table.boolean('enableServiceQrPayment').notNullable().defaultTo(1);
            table.boolean('enableServiceTopup').notNullable().defaultTo(1);
            table.boolean('enableServiceBankTransfer').notNullable().defaultTo(1);
            
            table.string('bankAccountNo').notNullable();
            table.string('bankAccountNoView').notNullable();
            table.string('bankPromptPayNo');
            table.string('bankAccountNameTh').notNullable();
            table.string('bankAccountNameEn').notNullable();
            table.string('bankBranchName');

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
    return knex.schema.dropTable('bankAccounts');
};
