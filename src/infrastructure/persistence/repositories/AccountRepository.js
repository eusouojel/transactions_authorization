import knex from 'knex';
import knexConfig from '../../../../knexfile.cjs';
import { Account } from '../../../domain/entities/account.js';

const db = knex(knexConfig.development);

export const findAccountById = async accountId => {
  const accountRecord = await db('accounts').where({ id: accountId }).first();
  
  if (!accountRecord) {
    return null;
  }

  return Account(
    accountRecord.id,
    accountRecord.food_balance,
    accountRecord.meal_balance,
    accountRecord.cash_balance
  );
};

export const updateAccount = async account => {
  await db('accounts').where({ id: account.id }).update({
    food_balance: account.foodBalance,
    meal_balance: account.mealBalance,
    cash_balance: account.cashBalance
  });
};
