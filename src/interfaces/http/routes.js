import express from 'express';
import transactionsController from './transactionsController.js';

const router = express.Router();

router.use('/transactions', transactionsController);

export default router;