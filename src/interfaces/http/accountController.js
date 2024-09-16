export const accountController = (createAccountUseCase, addBalanceUseCase, getAccountUseCase) => {
  return {
    createAccount: async (req, res) => {
      try {
        const { accountId, foodBalance, mealBalance, cashBalance } = req.body;

        if (!accountId) {
          return res.status(400).json({ message: 'Account ID is required.' });
        }

        const result = await createAccountUseCase({
          accountId,
          foodBalance,
          mealBalance,
          cashBalance,
        });

        if (result.success) {
          return res.status(201).json({ message: 'Account created successfully.', account: result.account });
        } else {
          return res.status(400).json({ message: 'Failed to create account.' });
        }
      } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    },

    addBalance: async (req, res) => {
      try {
        const { accountId, balanceType, amount } = req.body;

        if (!accountId || !balanceType || amount === undefined) {
          return res.status(400).json({ message: 'accountId, balanceType, and amount are required.' });
        }

        const result = await addBalanceUseCase({
          accountId,
          balanceType,
          amount,
        });

        if (result.success) {
          return res.status(200).json({ message: 'Balance added successfully.' });
        } else {
          return res.status(400).json({ message: result.message });
        }
      } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    },

    getAccount: async (req, res) => {
      try {
        const { accountId } = req.params;

        const result = await getAccountUseCase({
          accountId,
        });

        if (result.success) {
          return res.status(200).json({ account: result.account });
        } else {
          return res.status(404).json({ message: result.message });
        }
      } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    },
  };
};
