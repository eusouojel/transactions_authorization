import knex from 'knex';
import knexConfig from '../../../../knexfile.cjs';

const db = knex(knexConfig.development);

export const TransactionRepositoryDatabase = () => {
  const create = async (transaction) => {
    await db('transactions').insert({
      account_id: transaction.accountId,
      mcc: transaction.mcc,
      total_amount: transaction.totalAmount,
      merchant: transaction.merchant
    });
  };

  return {
    create,
  };
};
