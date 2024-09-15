import { authorizeTransactionService } from '../../domain/services/transactionAuthorizationService.js';
import { AccountRepository } from '../../domain/repositories/accountRepository.js';
import { TransactionRepository } from '../../domain/repositories/transactionRepository.js';

export const authorizeTransactionUseCase = (dependencies) => {
  return async (input) => {
    const {
      accountRepository = AccountRepository(),
      transactionRepository = TransactionRepository(),
    } = dependencies;
    
    const { accountId, totalAmount, mcc, merchant } = input;

    const account = await accountRepository.findById(accountId);

    if (!account) {
      return { success: false, code: '07' };
    }

    const authorization = authorizeTransactionService(
      account,
      totalAmount,
      mcc,
      merchant
    );

    if (!authorization.success) {
      return { success: false, code: authorization.code };
    }

    await transactionRepository.create({
      accountId,
      totalAmount,
      mcc,
      merchant,
    });

    await accountRepository.update(authorization.account);

    return { success: true, code: authorization.code };
  };
};
