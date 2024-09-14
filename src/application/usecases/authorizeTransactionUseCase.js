import { authorizeTransactionService } from '../../domain/services/transactionAuthorizationService.js';
import { findAccountById, updateAccount } from '../../infrastructure/persistence/repositories/AccountRepository.js';
import { createTransaction } from '../../infrastructure/persistence/repositories/TransactionRepository.js';


export const authorizeTransactionUseCase = async (accountId, totalAmount, mcc, merchant) => {
  
  const account = await findAccountById(accountId);
  
  if (!account) {
    return { success: false, error: 'Account not found' };
  }

  const authorization = authorizeTransactionService(account, totalAmount, mcc, merchant);
  
  if (!authorization.success) {
    return { success: false, code: authorization.code };
  }

  await createTransaction({ 
    accountId, 
    totalAmount, 
    mcc, 
    merchant 
  });

  await updateAccount(authorization.account);

  return { success: true, code: authorization.code };
};
