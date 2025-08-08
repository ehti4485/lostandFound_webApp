import express from 'express';
import cors from 'cors';
import itemRoutes from './routes/item.routes';
import authRoutes from './routes/auth.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/items', itemRoutes);
app.use('/api/auth', authRoutes);

export default app;

