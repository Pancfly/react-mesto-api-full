const express = require('express');

require('dotenv').config();

const cookieParser = require('cookie-parser');

const cors = require('cors');

const { errors, celebrate, Joi } = require('celebrate');

const mongoose = require('mongoose', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
const errorHandler = require('./middlewares/errors');
const auth = require('./middlewares/auth');
const { createUser, login, logout } = require('./controllers/user');
const userRouters = require('./routes/user');
const cardRouters = require('./routes/card');

const NotFoundError = require('./errors/not-found-error');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

const allowedCors = [
  'https://pancfly.students.nomoredomains.icu',
  'https://api.pancfly.students.nomoredomains.icu',
  'https://localhost:3000',
  'http://localhost:3000',
];

app.use(cors({
  origin: allowedCors,
}));

const mestodb = 'mongodb://localhost:27017/mestodb';
const { PORT = 3000 } = process.env;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^https?:\/\/(www.)?[a-zA-Z0-9-.]+\.[a-zA-Z]{2,}([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+)*#*$/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
  }),
}), createUser);
app.get('/logout', logout);

app.use(auth);

app.use('/', userRouters);
app.use('/', cardRouters);

app.use('*', () => {
  throw new NotFoundError('Не существующий адрес.');
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

// eslint-disable-next-line no-console
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

mongoose.connect(mestodb);
