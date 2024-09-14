import { validateTransactionInput } from './validationService.js';

const balanceTypes = {
  '5411': 'foodBalance',
  '5412': 'foodBalance',
  '5811': 'mealBalance',
  '5812': 'mealBalance'
};

const mapMccToBalanceType = mcc => balanceTypes[mcc];
// const mapMccToBalanceType = mcc => balanceTypes[mcc] || 'cashBalance';

const hasSufficientBalance = (account, totalAmount, balanceType) => 
  account[balanceType] >= totalAmount;

const debitBalance = (account, totalAmount, balanceType) => ({
  ...account,
  [balanceType]: account[balanceType] - totalAmount
});

export const authorizeTransactionService = (account, totalAmount, mcc) => {
  const validation = validateTransactionInput(account, totalAmount, mcc);
  
  if (!validation.isValid) {
    return { success: false, error: validation.error, code: '07' };
  }

  const balanceType = mapMccToBalanceType(mcc);

  if (!balanceType) {
    return { success: false, error: `MCC ${mcc} does not exist`, code: '07' };
  }

  if (!hasSufficientBalance(account, totalAmount, balanceType)) {
    return { success: false, error: `Insufficient balance in ${balanceType}` };
  }

  const updatedAccount = debitBalance(account, totalAmount, balanceType);
  
  return { success: true, account: updatedAccount, code: '00' };
};