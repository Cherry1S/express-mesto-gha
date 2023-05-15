const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => { res.send(card) })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
        return
      }
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)

    .then((card) => { res.send(card) })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Передан некорректный id' });
        return
      }
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Карточка не найдена' });
        return
      }
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => { res.send(card) })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
        return
      }
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Карточка не найдена' });
        return
      }
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => { res.send(card) })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
        return
      }
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Несуществующий id карточки' });
        return
      }
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };
