const express = require('express');

require('dotenv').config();

const helmet = require('helmet');

const rateLimit = require('express-rate-limit');

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
const { createUser, login } = require('./controllers/user');
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
  'localhost:3000',
];

const mestodb = 'mongodb://localhost:27017/mestodb';
const { PORT = 3000 } = process.env;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);
app.use(express.json());
app.use(helmet());
app.disable('x-power-by');
app.use(cookieParser());
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

app.use(auth);

app.use('/', userRouters);
app.use('/', cardRouters);

app.use('*', () => {
  throw new NotFoundError('Не существующий адрес.');
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

// eslint-disable-next-line func-names
app.use(function (req, res, next) {
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    return res.end();
  }
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

mongoose.connect(mestodb);
