import { describe, it, expect } from 'vitest';
import { authorizeTransactionService } from '../../../src/domain/services/transactionAuthorizationService.js';

describe('authorizeTransactionService', () => {
  it('deve retornar erro se o totalAmount for inválido', () => {
    const account = {
      id: '123',
      foodBalance: 100,
      mealBalance: 50,
      cashBalance: 200,
    };
    const totalAmount = -10;
    const mcc = '5411';

    const result = authorizeTransactionService(account, totalAmount, mcc);

    expect(result.success).toBe(false);
    expect(result.code).toBe('07');
    expect(result.error).toBe('Invalid totalAmount. It must be a positive number.');
  });

  it('deve retornar erro se o MCC for inválido', () => {
    const account = {
      id: '123',
      foodBalance: 100,
      mealBalance: 50,
      cashBalance: 200,
    };
    const totalAmount = 30;
    const mcc = '9999';

    const result = authorizeTransactionService(account, totalAmount, mcc);

    expect(result.success).toBe(false);
    expect(result.code).toBe('07');
    expect(result.error).toBe('Invalid MCC code.');
  });

  it('deve retornar erro se o saldo for insuficiente', () => {
    const account = {
      id: '123',
      foodBalance: 20,
      mealBalance: 50,
      cashBalance: 200,
    };
    const totalAmount = 30;
    const mcc = '5411';

    const result = authorizeTransactionService(account, totalAmount, mcc);

    expect(result.success).toBe(false);
    expect(result.code).toBe('51');
    expect(result.error).toBe('Insufficient balance in foodBalance');
  });

  it('deve autorizar transação válida', () => {
    const account = {
      id: '123',
      foodBalance: 100,
      mealBalance: 50,
      cashBalance: 200,
    };
    const totalAmount = 30;
    const mcc = '5411';

    const result = authorizeTransactionService(account, totalAmount, mcc);

    expect(result.success).toBe(true);
    expect(result.code).toBe('00');
    expect(result.account.foodBalance).toBe(70); // 100 - 30
  });
});
