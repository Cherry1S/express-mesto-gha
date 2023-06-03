const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

mongoose.connect(DB_URL).then(() => console.log('Connected to DB'));

app.use(express.json());
app.use(router);
app.use(errors());
app.use(errorHandler);
app.listen(PORT);
