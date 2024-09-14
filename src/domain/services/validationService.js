export const validateTransactionInput = (mcc) => {
  const validMccs = ['5411', '5412', '5811', '5812'];

  if (!validMccs.includes(mcc)) {
    return { isValid: false, error: 'Invalid MCC code.' };
  }

  return { isValid: true };
};