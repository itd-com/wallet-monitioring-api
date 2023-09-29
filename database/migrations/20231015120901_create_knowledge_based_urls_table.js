/**
 * @param {import("knex") knex}
 */
exports.up = (knex) => {
    return knex.schema
        .createTable('knowledgeBasedUrls', (table) => {
            table.increments('id').primary();

            table.string('url').notNullable();

            table.string('description');
            table.string('note');

            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });
};

/**
 * @param {import("knex") knex}
 */
exports.down = (knex) => {
    return knex.schema.dropTable('knowledgeBasedUrls');
};
