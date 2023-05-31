const router = require('express').Router();
const http2 = require('node:http2');
const authMiddleware = require('../middlewares/auth');
const userRouter = require('./users');
const cardRouter = require('./cards');
const {
  createUser, login,
} = require('../controllers/users');

const {
  loginCelebrate,
  createUserCelebrate,
} = require('../middlewares/reqValidation');

router.post('/signin', loginCelebrate, login);
router.post('/signup', createUserCelebrate, createUser);

router.use(authMiddleware);
router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use((req, res) => {
  res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Передан несуществующий запрос' });
});

module.exports = router;
