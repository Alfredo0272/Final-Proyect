import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import createDebug from 'debug';
import { userRouter } from './routes/user.reoutes';
import { errorMiddleware } from './middleware/error.middleware';

const debug = createDebug('W9Final:app');
export const app = express();
debug('Starting');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));
app.use('/users', userRouter);

app.use(errorMiddleware);
