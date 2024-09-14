import express from 'express';
import bodyParser from 'body-parser';
import routes from './interfaces/http/routes.js';

const app = express();

app.use(bodyParser.json());

app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
