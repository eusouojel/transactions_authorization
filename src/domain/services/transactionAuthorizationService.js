import { validateTransactionInput } from './validationService.js';

const getMerchantMcc = (merchant) => {
  const merchantToMcc = {
    'UBER TRIP                   SAO PAULO BR': '5812',
    'UBER EATS                   SAO PAULO BR': '5819',
    'PAG*JoseDaSilva          RIO DE JANEI BR': '5411',
    'PICPAY*BILHETEUNICO           GOIANIA BR': '5812',
  };

  return merchantToMcc[merchant] || null;
};

export const authorizeTransactionService = (account, totalAmount, mcc, merchant) => {

  let validationResult = validateTransactionInput(totalAmount, mcc);
  
  if (!validationResult.isValid && validationResult.error.includes('MCC')) {
    console.log('MCC inválido.');
    const merchantMcc = getMerchantMcc(merchant);
    
    mcc = merchantMcc || mcc;
    
    console.log('Utilizando o MCC do comerciante');
    validationResult = validateTransactionInput(totalAmount, mcc);
  }

  if (!validationResult.isValid) {
    console.log('MCC inválido.');
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

  const balanceToUse = account[balanceType] >= totalAmount ? balanceType : 'cashBalance';
  console.log(`utilizando o saldo do ${balanceToUse}`);

  if (account[balanceToUse] < totalAmount) {
    console.log(`Saldo insuficiente em ${balanceToUse}`);
    return {
      success: false,
      error: `Insufficient balance in ${balanceToUse} and cashBalance`,
      code: '51',
    };
  }

  const updatedAccount = {
    ...account,
    [balanceToUse]: account[balanceToUse] - totalAmount,
  };

  return { success: true, account: updatedAccount, code: '00' };
};
