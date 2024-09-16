export const getAccountUseCase = (dependencies) => {
  return async (input) => {
    const { accountRepository = dependencies.accountRepository } = dependencies;
    
    const { accountId } = input;

    const account = await accountRepository.findById(accountId);

    if (!account) {
      return { success: false, message: 'Account not found.' };
    }

    return { success: true, account };
  };
};
