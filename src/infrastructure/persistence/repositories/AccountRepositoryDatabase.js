import knex from 'knex';
import knexConfig from '../../../../knexfile.cjs';
import { Account } from '../../../domain/entities/account.js';

const db = knex(knexConfig.development);

export const AccountRepositoryDatabase = () => {
  const findById = async (accountId) => {
    const accountRecord = await db('accounts')
      .where({ account_id: accountId })
      .first();

    if (!accountRecord) {
      return null;
    }

    return Account(
      accountRecord.account_id,
      accountRecord.food_balance,
      accountRecord.meal_balance,
      accountRecord.cash_balance
    );
  };

  const update = async (account) => {
    await db('accounts').where({ account_id: account.accountId }).update({
      food_balance: account.foodBalance,
      meal_balance: account.mealBalance,
      cash_balance: account.cashBalance,
    });
  };

  const create = async (account) => {
    await db('accounts').insert({
      account_id: account.accountId,
      food_balance: account.foodBalance,
      meal_balance: account.mealBalance,
      cash_balance: account.cashBalance,
    });
  };

  const addBalance = async (accountId, balanceType, amount) => {
    await db('accounts')
      .where({ account_id: accountId })
      .increment(`${balanceType}`, amount);
  };

  return {
    findById,
    update,
    create,
    addBalance,
  };
};
