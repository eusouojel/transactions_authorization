import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authorizeTransactionUseCase } from '../../../src/application/usecases/authorizeTransactionUseCase.js';
import { authorizeTransactionService } from '../../../src/domain/services/transactionAuthorizationService.js';

vi.mock('../../../src/domain/services/transactionAuthorizationService.js');

describe('authorizeTransactionUseCase', () => {
  let accountRepositoryMock;
  let transactionRepositoryMock;
  let useCase;

  beforeEach(() => {
    accountRepositoryMock = {
      findById: vi.fn(),
      update: vi.fn(),
    };

    transactionRepositoryMock = {
      create: vi.fn(),
    };

    useCase = authorizeTransactionUseCase({
      accountRepository: accountRepositoryMock,
      transactionRepository: transactionRepositoryMock,
    });
  });

  it('deve retornar erro se a conta não for encontrada', async () => {
    accountRepositoryMock.findById.mockResolvedValue(null);

    const input = {
      accountId: '123',
      totalAmount: 30,
      mcc: '5411',
      merchant: 'Test Merchant',
    };

    const result = await useCase(input);

    expect(accountRepositoryMock.findById).toHaveBeenCalledWith('123');
    expect(result).toEqual({ success: false, code: '07' });
  });

  it('deve retornar erro se o serviço de autorização falhar', async () => {
    accountRepositoryMock.findById.mockResolvedValue({
      id: '123',
      foodBalance: 100,
      mealBalance: 50,
      cashBalance: 200,
    });

    authorizeTransactionService.mockReturnValue({
      success: false,
      error: 'Saldo insuficiente em foodBalance',
      code: '51',
    });

    const input = {
      accountId: '123',
      totalAmount: 150,
      mcc: '5411',
      merchant: 'Test Merchant',
    };

    const result = await useCase(input);

    expect(authorizeTransactionService).toHaveBeenCalledWith(
      {
        id: '123',
        foodBalance: 100,
        mealBalance: 50,
        cashBalance: 200,
      },
      150,
      '5411'
    );
    expect(result).toEqual({ success: false, code: '51' });
  });

  it('deve criar transação e atualizar conta se a autorização for bem-sucedida', async () => {
    const updatedAccount = {
      id: '123',
      foodBalance: 70,
      mealBalance: 50,
      cashBalance: 200,
    };

    accountRepositoryMock.findById.mockResolvedValue({
      id: '123',
      foodBalance: 100,
      mealBalance: 50,
      cashBalance: 200,
    });

    authorizeTransactionService.mockReturnValue({
      success: true,
      account: updatedAccount,
      code: '00',
    });

    const input = {
      accountId: '123',
      totalAmount: 30,
      mcc: '5411',
      merchant: 'Test Merchant',
    };

    const result = await useCase(input);

    expect(authorizeTransactionService).toHaveBeenCalledWith(
      {
        id: '123',
        foodBalance: 100,
        mealBalance: 50,
        cashBalance: 200,
      },
      30,
      '5411'
    );

    expect(transactionRepositoryMock.create).toHaveBeenCalledWith({
      accountId: '123',
      totalAmount: 30,
      mcc: '5411',
      merchant: 'Test Merchant',
    });

    expect(accountRepositoryMock.update).toHaveBeenCalledWith(updatedAccount);
    expect(result).toEqual({ success: true, code: '00' });
  });
});
