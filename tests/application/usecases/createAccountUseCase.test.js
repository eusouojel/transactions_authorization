// tests/application/useCases/createAccountUseCase.test.js

import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { createAccountUseCase } from '../../../src/application/usecases/createAccountUseCase.js';

describe('createAccountUseCase', () => {
  let accountRepositoryMock;
  let useCase;

  beforeEach(() => {
    accountRepositoryMock = {
      create: vi.fn(),
    };

    useCase = createAccountUseCase({ accountRepository: accountRepositoryMock });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('should create a new account successfully', async () => {
    const input = {
      accountId: '1',
      foodBalance: 100,
      mealBalance: 50,
      cashBalance: 200,
    };

    await useCase(input);

    expect(accountRepositoryMock.create).toHaveBeenCalledWith({
      accountId: '1',
      foodBalance: 100,
      mealBalance: 50,
      cashBalance: 200,
    });
  });

  it('should handle errors during account creation', async () => {
    const input = {
      accountId: '1',
      foodBalance: 100,
      mealBalance: 50,
      cashBalance: 200,
    };

    accountRepositoryMock.create.mockRejectedValueOnce(new Error('Database error'));

    await expect(useCase(input)).rejects.toThrow('Database error');
  });
});
