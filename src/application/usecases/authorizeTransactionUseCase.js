import { authorizeTransactionService } from '../../domain/services/transactionAuthorizationService.js';
import { findAccountById, updateAccount } from '../../infrastructure/persistence/AccountRepository.js';
import { createTransaction } from '../../infrastructure/persistence/TransactionRepository.js';


export const authorizeTransactionUseCase = async (accountId, totalAmount, mcc, merchant) => {
  
  const account = await findAccountById(accountId);
  
  if (!account) {
    return { success: false, error: 'Account not found' };
  }

  const result = authorizeTransactionService(account, totalAmount, mcc, merchant);
  
  if (!result.success) {
    return { success: false, error: result.error };
  }

  await createTransaction({ 
    accountId, 
    totalAmount, 
    mcc, 
    merchant 
  });

  await updateAccount(result.account);

  return { success: true, code: result.code };
};
