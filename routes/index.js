const router = require('express').Router();
const http2 = require('node:http2');
const userRouter = require('./users');
const cardRouter = require('./cards');

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use((req, res) => {
  res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Передан несуществующий запрос' });
});

module.exports = router;
