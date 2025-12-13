import express from 'express';
import cors from 'cors';
import syncRoutes from './routes/sync';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import transactionRoutes from './routes/transactions';
import expenseRoutes from './routes/expenses';
import bankRoutes from './routes/bank';
import settingsRoutes from './routes/settings';
import stockRoutes from './routes/stock';
import developerRoutes from './routes/developer';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/bank', bankRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/developer', developerRoutes);

app.get('/', (req, res) => {
    res.send('POS API Server Running');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
