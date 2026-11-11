import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler';
import apiRoutes from './routes';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api', apiRoutes);

app.use(errorHandler);

export default app;
