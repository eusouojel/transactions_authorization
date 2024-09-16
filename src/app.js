import express from 'express';
import accountRoutes from './interfaces/http/accountRoutes.js';
import transactionRoutes from './interfaces/http/transactionRoutes.js';

const app = express();

app.use(express.json());

const useRouter = express.Router();

useRouter.use('/accounts', accountRoutes);
useRouter.use('/transactions', transactionRoutes);

app.use('/api/v1', useRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
