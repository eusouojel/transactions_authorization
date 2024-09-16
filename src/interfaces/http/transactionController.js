import { validationResult } from 'express-validator';

export const transactionController = (authorizeTransaction) => {
  return {
    authorizeTransaction: async (req, res) => {
      try {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
          return res.status(200).json({ code: '07', errors: errors.array() });
        }
    
        const { accountId, totalAmount, mcc, merchant } = req.body;

        const result = await authorizeTransaction({
          accountId,
          totalAmount: parseFloat(totalAmount),
          mcc,
          merchant,
        });
  
        return res.status(200).json({ code: result.code });
      } catch (error) {
        console.error('Erro interno do servidor -', error);
        return res.status(200).json({ code: '07' });
      }
    },
  };
};
