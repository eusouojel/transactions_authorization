import express from 'express';
import { body, validationResult } from 'express-validator';
import { transactionController } from './transactionController.js';
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

const controller = transactionController(authorizeTransaction);

router.post(
  '/',
  [
    body('accountId').isInt().notEmpty(),
    body('totalAmount').isFloat({ gt: 0 }),
    body('mcc').isString().notEmpty(),
    body('merchant').isString().notEmpty(),
  ],
  controller.authorizeTransaction);

export default router;