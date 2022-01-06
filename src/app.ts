import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import apiRoutes from '../routes/api';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', apiRoutes);

export default app;
