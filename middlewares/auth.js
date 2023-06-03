const jwt = require('jsonwebtoken');
const http2 = require('node:http2');

const { JWT_SECRET = 'super-strong-secret' } = process.env;

const handleAuthError = (res) => {
  res.status(http2.constants.HTTP_STATUS_UNAUTHORIZED).send({ message: 'Необходима авторизация' });
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  next();
};
