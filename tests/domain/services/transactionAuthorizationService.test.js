import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authorizeTransactionService } from '../../../src/domain/services/transactionAuthorizationService.js';
import { validateTransactionInput } from '../../../src/domain/services/validationService.js';


vi.mock('../../../src/domain/services/validationService.js', () => ({
  validateTransactionInput: vi.fn(),
}));

describe('authorizeTransactionService', () => {
  let account;

  beforeEach(() => {
    vi.resetAllMocks();

    account = {
      id: '123',
      foodBalance: 100,
      mealBalance: 50,
      cashBalance: 200,
    };
  });

  // L1 - Casos Básicos**

  it('deve aprovar a transação se o MCC for válido e saldo suficiente', () => {
    validateTransactionInput.mockReturnValue({ isValid: true });

    const totalAmount = 30;
    const mcc = '5411';
    const merchant = 'Some Merchant';

    const result = authorizeTransactionService(account, totalAmount, mcc, merchant);

    expect(validateTransactionInput).toHaveBeenCalledWith(totalAmount, mcc);
    expect(result).toEqual({
      success: true,
      account: {
        id: '123',
        foodBalance: 70,
        mealBalance: 50,
        cashBalance: 200,
      },
      code: '00',
    });
  });

  it('deve retornar erro se o MCC for inválido e o comerciante não fornecer um MCC válido', () => {
    
    validateTransactionInput.mockReturnValueOnce({
      isValid: false,
      error: 'Invalid MCC code.',
    });

    validateTransactionInput.mockReturnValueOnce({
      isValid: false,
      error: 'Invalid MCC code.',
    });

    const totalAmount = 30;
    const mcc = '9999';
    const merchant = 'Some Merchant';

    const result = authorizeTransactionService(account, totalAmount, mcc, merchant);

    expect(validateTransactionInput).toHaveBeenCalledWith(totalAmount, mcc);
    expect(validateTransactionInput).toHaveBeenCalledWith(totalAmount, '9999');
    expect(result).toEqual({
      success: false,
      error: 'Invalid MCC code.',
      code: '07',
    });
  });

  it('deve retornar erro se houver outro erro de validação que não seja o MCC', () => {
    
    validateTransactionInput.mockReturnValueOnce({
      isValid: false,
      error: 'Invalid totalAmount. It must be a positive number.',
    });

    const totalAmount = -10;
    const mcc = '5411';
    const merchant = 'Some Merchant';

    const result = authorizeTransactionService(account, totalAmount, mcc, merchant);

    expect(validateTransactionInput).toHaveBeenCalledWith(totalAmount, mcc);
    expect(result).toEqual({
      success: false,
      error: 'Invalid totalAmount. It must be a positive number.',
      code: '07',
    });
  });

  // L2 - Fallback para cashBalance

  it('deve aprovar a transação usando cashBalance se saldo principal for insuficiente', () => {
    validateTransactionInput.mockReturnValue({ isValid: true });

    const totalAmount = 120;
    const mcc = '5411';
    const merchant = 'Some Merchant';

    const result = authorizeTransactionService(account, totalAmount, mcc, merchant);

    expect(validateTransactionInput).toHaveBeenCalledWith(totalAmount, mcc);
    expect(result).toEqual({
      success: true,
      account: {
        id: '123',
        foodBalance: 100,
        mealBalance: 50,
        cashBalance: 80,
      },
      code: '00',
    });
  });

  it('deve rejeitar a transação se saldo principal e cashBalance forem insuficientes', () => {
    validateTransactionInput.mockReturnValue({ isValid: true });

    const totalAmount = 350;
    const mcc = '5411';
    const merchant = 'Some Merchant';

    const result = authorizeTransactionService(account, totalAmount, mcc, merchant);

    expect(validateTransactionInput).toHaveBeenCalledWith(totalAmount, mcc);
    expect(result).toEqual({
      success: false,
      error: 'Insufficient balance.',
      code: '51',
    });
  });

  // L3 - Substituição do MCC pelo MCC do Comerciante

  it('deve substituir o MCC pelo MCC do comerciante quando MCC inicial for inválido e aprovar a transação', () => {
    
    validateTransactionInput.mockReturnValueOnce({
      isValid: false,
      error: 'MCC inválido',
    });

    validateTransactionInput.mockReturnValueOnce({ isValid: true });

    const totalAmount = 20;
    const mcc = '9999';
    const merchant = 'UBER TRIP                   SAO PAULO BR';

    const result = authorizeTransactionService(account, totalAmount, mcc, merchant);

    expect(validateTransactionInput).toHaveBeenCalledWith(totalAmount, mcc);
    expect(validateTransactionInput).toHaveBeenCalledWith(totalAmount, '5812');
    expect(result).toEqual({
      success: true,
      account: {
        id: '123',
        foodBalance: 100,
        mealBalance: 30,
        cashBalance: 200,
      },
      code: '00',
    });
  });

  it('deve substituir o MCC pelo MCC do comerciante e usar cashBalance como fallback se saldo da categoria substituída for insuficiente', () => {
    
    validateTransactionInput.mockReturnValueOnce({
      isValid: false,
      error: 'Invalid MCC code.',
    });

    
    validateTransactionInput.mockReturnValueOnce({ isValid: true });

    const totalAmount = 30;
    const mcc = '9999';
    const merchant = 'UBER TRIP                   SAO PAULO BR';

    const testAccount = {
      ...account,
      mealBalance: 10,
      cashBalance: 200,
    };

    validateTransactionInput.mockImplementation((amount, mccParam) => {
      if (mccParam === '5812') {
        return { isValid: true };
      }
      return { isValid: false, error: 'Invalid MCC code.' };
    });

    const result = authorizeTransactionService(testAccount, totalAmount, mcc, merchant);

    expect(validateTransactionInput).toHaveBeenCalledWith(totalAmount, mcc);
    expect(validateTransactionInput).toHaveBeenCalledWith(totalAmount, '5812');
    expect(result).toEqual({
      success: true,
      account: {
        id: '123',
        foodBalance: 100,
        mealBalance: 10,
        cashBalance: 170,
      },
      code: '00',
    });
  });

  it('deve rejeitar a transação se MCC inicial for inválido e substituição pelo MCC do comerciante falhar', () => {

    validateTransactionInput.mockReturnValueOnce({
      isValid: false,
      error: 'Invalid MCC code.',
    });

    validateTransactionInput.mockReturnValueOnce({
      isValid: false,
      error: 'Invalid MCC code.',
    });

    const totalAmount = 30;
    const mcc = '9999';
    const merchant = 'Some Merchant';

    const result = authorizeTransactionService(account, totalAmount, mcc, merchant);

    expect(validateTransactionInput).toHaveBeenCalledWith(totalAmount, mcc);
    expect(validateTransactionInput).toHaveBeenCalledWith(totalAmount, '9999');
    expect(result).toEqual({
      success: false,
      error: 'Invalid MCC code.',
      code: '07',
    });
  });

  // Testes Adicionais

  it('deve aprovar a transação usando o MCC original se for válido mesmo que o comerciante forneça um MCC', () => {
    
    validateTransactionInput.mockReturnValue({ isValid: true });

    const totalAmount = 40;
    const mcc = '5411';
    const merchant = 'UBER EATS                   SAO PAULO BR';

    const result = authorizeTransactionService(account, totalAmount, mcc, merchant);

    expect(validateTransactionInput).toHaveBeenCalledWith(totalAmount, mcc);
    
    expect(validateTransactionInput).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      success: true,
      account: {
        id: '123',
        foodBalance: 60,
        mealBalance: 50,
        cashBalance: 200,
      },
      code: '00',
    });
  });

  it('deve aprovar a transação usando o MCC do comerciante quando o MCC original for inválido', () => {
    
    validateTransactionInput.mockReturnValueOnce({
      isValid: false,
      error: 'Invalid MCC code.',
    });

    validateTransactionInput.mockReturnValueOnce({ isValid: true });

    const totalAmount = 20;
    const mcc = '9999';
    const merchant = 'UBER EATS                   SAO PAULO BR';

    const result = authorizeTransactionService(account, totalAmount, mcc, merchant);

    expect(validateTransactionInput).toHaveBeenCalledWith(totalAmount, mcc);
    expect(validateTransactionInput).toHaveBeenCalledWith(totalAmount, '5819');
    expect(result).toEqual({
      success: true,
      account: {
        id: '123',
        foodBalance: 100,
        mealBalance: 50,
        cashBalance: 180,
      },
      code: '00',
    });
  });
});
