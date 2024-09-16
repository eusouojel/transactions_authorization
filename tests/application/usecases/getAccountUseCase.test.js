import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { getAccountUseCase } from '../../../src/application/usecases/getAccountUseCase.js';

describe('getAccountUseCase', () => {
  let accountRepositoryMock;
  let useCase;

  beforeEach(() => {
    accountRepositoryMock = {
      findById: vi.fn(),
    };

    useCase = getAccountUseCase({ accountRepository: accountRepositoryMock });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('deve retornar os dados da conta se existir', async () => {
    const input = {
      accountId: 1,
    };

    const mockAccount = {
      id: 1,
      foodBalance: 100,
      mealBalance: 50,
      cashBalance: 200,
    };

    accountRepositoryMock.findById.mockResolvedValueOnce(mockAccount);

    const result = await useCase(input);

    expect(accountRepositoryMock.findById).toHaveBeenCalledWith(1);
    expect(result).toEqual({ success: true, account: mockAccount });
  });

  it('deve retornar erro se a conta não existir', async () => {
    const input = {
      accountId: 20,
    };

    accountRepositoryMock.findById.mockResolvedValueOnce(null);

    const result = await useCase(input);

    expect(accountRepositoryMock.findById).toHaveBeenCalledWith(20);
    expect(result).toEqual({ success: false, message: 'Account not found.' });
  });

  it('deve lançar erro se buscar a conta falhar no repositório', async () => {
    const input = {
      accountId: 1,
    };

    accountRepositoryMock.findById.mockRejectedValueOnce(new Error('Database error'));

    await expect(useCase(input)).rejects.toThrow('Database error');
    expect(accountRepositoryMock.findById).toHaveBeenCalledWith(1);
  });
});
