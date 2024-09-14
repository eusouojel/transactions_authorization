export const validateTransactionInput = (account, totalAmount, mcc) => {
  if (!account) {
    return { isValid: false, error: 'Account not found' };
  }

  if (typeof totalAmount !== 'number' || totalAmount <= 0) {
    return { isValid: false, error: 'Invalid totalAmount. It must be a positive number' };
  }

  const validMccs = ['5411', '5412', '5811', '5812'];
  if (!validMccs.includes(mcc) && !/^\d{4}$/.test(mcc)) {
    return { isValid: false, error: 'Invalid MCC code. It must be a 4-digit number' };
  }

  return { isValid: true };
};