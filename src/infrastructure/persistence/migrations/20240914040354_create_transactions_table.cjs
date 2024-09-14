exports.up = function(knex) {
  return knex.schema.createTable('transactions', function(table) {
    table.increments('id').primary();
    table.integer('account_id').unsigned().notNullable();
    table.float('total_amount').notNullable();
    table.string('mcc').notNullable();
    table.string('merchant').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.foreign('account_id').references('accounts.id');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('transactions');
};
