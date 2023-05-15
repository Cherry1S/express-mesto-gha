const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => { res.send(user) })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный id пользователя' });
        return
      }
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Пользователь не найден' });
        return
      }
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => { res.send(user) })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
        return
      }
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};

const editProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => { res.send(user) })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
        return
      }
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Пользователь не найден' });
        return
      }
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};

const editAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => { res.send(user) })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
        return;
      }
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};

module.exports = { getUsers, getUserById, createUser, editProfile, editAvatar };
