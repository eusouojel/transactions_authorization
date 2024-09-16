import express from 'express';
import routes from './interfaces/http/routes.js';
import accountRoutes from './interfaces/http/accountRoutes.js';

const app = express();

app.use(express.json());

app.use('/api/v1', routes);
app.use('/api/v1/accounts', accountRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
