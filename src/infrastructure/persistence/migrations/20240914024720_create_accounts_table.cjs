exports.up = function(knex) {
  return knex.schema.createTable('accounts', function(table) {
    table.increments('id').primary();
    table.integer('account_id').notNullable();
    table.float('food_balance').notNullable();
    table.float('meal_balance').notNullable();
    table.float('cash_balance').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('accounts');
};