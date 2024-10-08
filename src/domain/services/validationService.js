export const validateTransactionInput = (totalAmount, mcc) => {
  const validMccs = ['5411', '5412', '5811', '5812'];

  if (typeof totalAmount !== 'number' || totalAmount <= 0) {
    return {
      isValid: false,
      error: 'Invalid totalAmount. It must be a positive number.'
    };
  }

  if (!validMccs.includes(mcc)) {
    return { isValid: false, error: 'Invalid MCC code.' };
  }

  return { isValid: true };
};