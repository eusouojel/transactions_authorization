import express from 'express';
import { accountController } from './accountController.js';
import { createAccountUseCase } from '../../application/usecases/createAccountUseCase.js';
import { addBalanceUseCase } from '../../application/usecases/addBalanceUseCase.js';
import { getAccountUseCase } from '../../application/usecases/getAccountUseCase.js';
import { AccountRepositoryDatabase } from '../../infrastructure/persistence/repositories/AccountRepositoryDatabase.js';

const router = express.Router();

const accountRepository = AccountRepositoryDatabase();

const createUseCase = createAccountUseCase({ accountRepository });
const addBalanceUseCaseInstance = addBalanceUseCase({ accountRepository });
const getUseCase = getAccountUseCase({ accountRepository });

const controller = accountController(createUseCase, addBalanceUseCaseInstance, getUseCase);

router.post('/create', controller.createAccount);
router.post('/add-balance', controller.addBalance);
router.get('/:accountId', controller.getAccount);

export default router;
