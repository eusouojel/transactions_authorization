exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('accounts').del();

  // Inserts seed entries
  await knex('accounts').insert([
    {
      food_balance: 100.00,
      meal_balance: 50.00,
      cash_balance: 200.00
    }
  ]);
};