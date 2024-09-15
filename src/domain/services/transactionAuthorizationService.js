export const authorizeTransactionService = (account, totalAmount, mcc) => {
  const balanceTypes = {
    '5411': 'foodBalance',
    '5412': 'foodBalance',
    '5811': 'mealBalance',
    '5812': 'mealBalance',
  };

  const balanceType = balanceTypes[mcc];

  if (!balanceType) {
    console.error(`MCC ${mcc} does not exist`);
    return {
      success: false,
      error: `MCC ${mcc} does not exist`,
      code: '07',
    };
  }

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
