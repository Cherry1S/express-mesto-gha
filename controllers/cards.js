const http2 = require('node:http2');
const mongoose = require('mongoose');
const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' }));
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => { res.status(http2.constants.HTTP_STATUS_CREATED).send(card); })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка не найдена' });
        return;
      }
      if (err instanceof mongoose.Error.CastError) {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Передан некорректный id' });
        return;
      }
      res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => { res.send(card); })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
        return;
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => { res.send(card); })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
        return;
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Несуществующий id карточки' });
        return;
      }
      res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
