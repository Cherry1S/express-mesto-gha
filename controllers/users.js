const http2 = require('node:http2');
const mongoose = require('mongoose');
const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(http2.constants.HTTP_STATUS_CREATED).send(users))
    .catch(() => res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' }));
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => { res.send(user); })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Передан некорректный id' });
        return;
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => { res.send(user); })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const editProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => { res.send(user); })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
        return;
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const editAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => { res.send(user); })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
        return;
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

module.exports = {
  getUsers, getUserById, createUser, editProfile, editAvatar,
};
