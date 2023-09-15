/**
 * @param {import("knex") knex}
 */
exports.up = (knex) => {
    return knex.schema
        .createTable('users', (table) => {
            table.increments('id').primary();

            table.string('name').unique().notNullable();
            table.string('email').unique().notNullable();
            table.string('username').unique().notNullable();
            table.text('passwordEcd', 'longtext').notNullable();
            table.enum('role', ['MY_APP', 'CUSTOMER_READ_ONLY', 'CUSTOMER', 'ADMIN_READ_ONLY', 'ADMIN', 'SUPER_ADMIN']).notNullable().defaultTo('CUSTOMER_READ_ONLY');

            table.text('accessToken', 'longtext').notNullable();
            table.datetime('accessTokenExpire').notNullable();

            table.text('apiToken', 'longtext').notNullable();
            table.datetime('apiTokenExpire').notNullable();

            table.text('externalApiToken', 'longtext').notNullable();
            table.datetime('externalApiTokenExpire').notNullable();

            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });
};

/**
 * @param {import("knex") knex}
 */
exports.down = (knex) => {
    return knex.schema.dropTable('users');
};
