import express from 'express';
import cors from 'cors';
import itemRoutes from './routes/item.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', itemRoutes);

export default app;

