import express from 'express';
import { authorizeTransactionUseCase } from '../../application/usecases/authorizeTransactionUseCase.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { accountId, totalAmount, mcc, merchant } = req.body;
  
  try {
    const result = await authorizeTransactionUseCase(accountId, totalAmount, mcc, merchant);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(200).json({ code: result.code });
  } catch (error) {
    return res.status(200).json({ error: `Internal Server Error - ${error}` });
  }
});

export default router;
