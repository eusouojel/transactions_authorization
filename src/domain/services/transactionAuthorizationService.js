import { validateTransactionInput } from './validationService.js';

export const authorizeTransactionService = (account, totalAmount, mcc) => {
  
  const validationResult = validateTransactionInput(totalAmount, mcc);
  
  if (!validationResult.isValid) {
    return {
      success: false,
      error: validationResult.error,
      code: '07',
    };
  }

  const balanceTypes = {
    '5411': 'foodBalance',
    '5412': 'foodBalance',
    '5811': 'mealBalance',
    '5812': 'mealBalance',
  };

  const balanceType = balanceTypes[mcc];

  if (account[balanceType] < totalAmount) {
    console.error(`Insufficient balance in ${balanceType}`);
    return {
      success: false,
      error: `Insufficient balance in ${balanceType}`,
      code: '51',
    };
  }

  const updatedAccount = {
    ...account,
    [balanceType]: account[balanceType] - totalAmount,
  };

  return { success: true, account: updatedAccount, code: '00' };
};
