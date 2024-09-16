export const addBalanceUseCase = (dependencies) => {
  return async (input) => {
    const { accountRepository = dependencies.accountRepository } = dependencies;
    
    const { accountId, balanceType, amount } = input;

    if (!['food_balance', 'meal_balance', 'cash_balance'].includes(balanceType)) {
      return { success: false, message: 'Invalid balance type.' };
    }

    if (amount <= 0) {
      return { success: false, message: 'Amount must be positive.' };
    }

    await accountRepository.addBalance(accountId, balanceType, amount);

    return { success: true };
  };
};
