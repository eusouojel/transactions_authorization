exports.seed = async function(knex) {
  await knex('accounts').del();
  await knex('accounts').insert([
    {
      account_id: 123,
      food_balance: 100.00,
      meal_balance: 50.00,
      cash_balance: 200.00
    }
  ]);
};