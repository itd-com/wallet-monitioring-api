/**
 * @param {import("knex") knex}
 */
exports.up = (knex) => {
    return knex.schema
        .createTable('bankGlobalConfigs', (table) => {
            table.increments('id').primary();
            table.string('class').notNullable();
            table.string('key').unique().notNullable();
            table.string('value').notNullable();

            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });
};

/**
 * @param {import("knex") knex}
 */
exports.down = (knex) => {
    return knex.schema.dropTable('bankGlobalConfigs');
};
