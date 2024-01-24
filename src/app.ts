import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import createDebug from 'debug';
import { userRouter } from './routes/user.routes.js';
import { handleError } from './middleware/error.middleware.js';
import { beerRouter } from './routes/beer.routes.js';
import { pubRouter } from './routes/pub.routes.js';

const debug = createDebug('W9Final:app');
export const app = express();
debug('Starting');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));
app.use('/user', userRouter);
app.use('/beer', beerRouter);
app.use('/pub', pubRouter);
app.use(handleError);
