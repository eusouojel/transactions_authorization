import express from 'express';
import { body, validationResult } from 'express-validator';
import { authorizeTransactionUseCase } from '../../application/usecases/authorizeTransactionUseCase.js';

const router = express.Router();

router.post(
  '/',
  [
    body('accountId').isInt().notEmpty(),
    body('totalAmount').isFloat({ gt: 0 }),
    body('mcc').isString().notEmpty(),
    body('merchant').isString().notEmpty(),
  ],
  async (req, res) => {

    const inputValidationErrors = validationResult(req);
    
    if (!inputValidationErrors.isEmpty()) {
      return res.status(200).json({ code: '07', errors: inputValidationErrors.array() });
    }
    
    const { accountId, totalAmount, mcc, merchant } = req.body;
    
    try {
      const result = await authorizeTransactionUseCase(accountId, totalAmount, mcc, merchant);

      if (!result.success) {
        return res.status(200).json({ error: result.code });
      }

      return res.status(200).json({ code: result.code });
    } catch (error) {
      return res.status(200).json({ error: `Internal Server Error - ${error}` });
    }
  }
);

export default router;
