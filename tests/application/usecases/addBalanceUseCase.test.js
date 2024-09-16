import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { addBalanceUseCase } from '../../../src/application/usecases/addBalanceUseCase.js';

describe('addBalanceUseCase', () => {
  let accountRepositoryMock;
  let useCase;

  beforeEach(() => {
    accountRepositoryMock = {
      addBalance: vi.fn(),
    };

    useCase = addBalanceUseCase({ accountRepository: accountRepositoryMock });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('deve adicionar saldo ao foodBalance com sucesso', async () => {
    const input = {
      accountId: 1,
      balanceType: 'food_balance',
      amount: 50,
    };

    accountRepositoryMock.addBalance.mockResolvedValueOnce();

    const result = await useCase(input);

    expect(accountRepositoryMock.addBalance).toHaveBeenCalledWith(1, 'food_balance', 50);
    expect(result).toEqual({ success: true });
  });

  it('deve adicionar saldo ao mealBalance com sucesso', async () => {
    const input = {
      accountId: '1',
      balanceType: 'meal_balance',
      amount: 30,
    };

    accountRepositoryMock.addBalance.mockResolvedValueOnce();

    const result = await useCase(input);

    expect(accountRepositoryMock.addBalance).toHaveBeenCalledWith('1', 'meal_balance', 30);
    expect(result).toEqual({ success: true });
  });

  it('deve adicionar saldo ao cashBalance com sucesso', async () => {
    const input = {
      accountId: '1',
      balanceType: 'cash_balance',
      amount: 100,
    };

    accountRepositoryMock.addBalance.mockResolvedValueOnce();

    const result = await useCase(input);

    expect(accountRepositoryMock.addBalance).toHaveBeenCalledWith('1', 'cash_balance', 100);
    expect(result).toEqual({ success: true });
  });

  it('deve retornar erro para balanceType inválido', async () => {
    const input = {
      accountId: '1',
      balanceType: 'invalidBalanceType',
      amount: 50,
    };

    const result = await useCase(input);

    expect(accountRepositoryMock.addBalance).not.toHaveBeenCalled();
    expect(result).toEqual({ success: false, message: 'Invalid balance type.' });
  });

  it('deve retornar erro para amount negativo ou zero', async () => {
    const input = {
      accountId: '1',
      balanceType: 'food_balance',
      amount: -10,
    };

    const result = await useCase(input);

    expect(accountRepositoryMock.addBalance).not.toHaveBeenCalled();
    expect(result).toEqual({ success: false, message: 'Amount must be positive.' });
  });

  it('deve lançar erro se adicionar saldo falhar no repositório', async () => {
    const input = {
      accountId: '1',
      balanceType: 'food_balance',
      amount: 50,
    };

    accountRepositoryMock.addBalance.mockRejectedValueOnce(new Error('Database error'));

    await expect(useCase(input)).rejects.toThrow('Database error');
    expect(accountRepositoryMock.addBalance).toHaveBeenCalledWith('1', 'food_balance', 50);
  });
});
