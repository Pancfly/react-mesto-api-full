const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');

const { Ok200 } = require('../utils/constanta');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  UserModel.find({})
    .then((data) => {
      res.status(Ok200).send({ data });
    })
    .catch(next);
};

module.exports.getUserId = (req, res, next) => {
  const { userId } = req.params;
  UserModel.findById(userId)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(Ok200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для поиска пользователя.'));
      } else if (err.message === 'NotValidId') {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => UserModel.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(Ok200).send({
        id: user._id, email: user.email, name: user.name, abote: user.aboute, avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует.'));
      } else {
        next(err);
      }
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  UserModel.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(Ok200).send(user);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля пользователя.'));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  UserModel.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(Ok200).send(user);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара пользователя.'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  UserModel.findOne({ email }).select('+password')
    .orFail(new Error('IncorrectEmail'))
    .then((user) => {
      bcrypt.compare(password, user.password, ((err, isValid) => {
        if (err || !isValid) {
          return next(new BadRequestError('Указан некорректный Email или пароль.'));
        }
        if (isValid) {
          const token =jwt.sign(
            { _id: user._id },
            'JWT_SECRET',
            { expiresIn: '7d' },
          );
          res.cookie('jwt', token, {
            httpOnly: true,
            sameSite: true,
          }).status(Ok200).send({ token: `${token}` });
        }
      }));
    })
    .catch((err) => {
      if (err.message === 'IncorrectEmail') {
        next(new BadRequestError('Указан некорректный Email или пароль.'));
      } else {
        next(err);
      }
    });
};

module.exports.getUserMe = (req, res, next) => {
  UserModel.findById(req.user._id)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(Ok200).send(user);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для поиска пользователя.'));
      } else {
        next(err);
      }
    });
};
