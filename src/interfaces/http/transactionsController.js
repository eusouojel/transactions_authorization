import express from 'express';
import { body, validationResult } from 'express-validator';
import { authorizeTransactionUseCase } from '../../application/usecases/authorizeTransactionUseCase.js';
import { AccountRepositoryDatabase } from '../../infrastructure/persistence/repositories/AccountRepositoryDatabase.js';
import { TransactionRepositoryDatabase } from '../../infrastructure/persistence/repositories/TransactionRepositoryDatabase.js';

const router = express.Router();

const accountRepository = AccountRepositoryDatabase();
const transactionRepository = TransactionRepositoryDatabase();

const authorizeTransaction = authorizeTransactionUseCase({
  accountRepository,
  transactionRepository,
});

router.post(
  '/',
  [
    body('accountId').isInt().notEmpty(),
    body('totalAmount').isFloat({ gt: 0 }),
    body('mcc').isString().notEmpty(),
    body('merchant').isString().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({ code: '07', errors: errors.array() });
    }

    const { accountId, totalAmount, mcc, merchant } = req.body;

    try {
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
  }
);

export default router;
