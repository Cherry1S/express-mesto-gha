const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb').then(() => console.log('Connected to DB'))

app.use((req, res, next) => {
  req.user = {
    _id: '64627185665bc5cf2403e1c0',
  };
  next();
});
app.use(express.json());
app.use(router);

app.listen(PORT, (error) => {
  error ? console.log(error) : console.log(`listening port ${PORT}`)
});
