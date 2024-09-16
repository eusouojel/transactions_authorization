import { Account } from '../../domain/entities/account.js';

export const createAccountUseCase = (dependencies) => {
  return async (input) => {
    const { accountRepository = dependencies.accountRepository } = dependencies;
    
    const { accountId, foodBalance = 0, mealBalance = 0, cashBalance = 0 } = input;

    const account = Account(accountId, foodBalance, mealBalance, cashBalance);
    
    await accountRepository.create(account);
    
    return { success: true, account };
  };
};
