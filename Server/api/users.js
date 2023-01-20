const express = require('express');
const { requireUser } = require('./utils');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const usersRouter = express.Router();
const { getUserByUsername, getAllUsers, createUser } = require('../db');

//Register
usersRouter.use((req, res, next) => {
  console.log('Request being made to users');
  next();
});

usersRouter.get('/', async (req, res) => {
  const users = await getAllUsers();
  console.log('these are my users', users);
  res.send({ users });
});

//REGISTER /api/users/register

usersRouter.post('/register', async (req, res, next) => {
  console.log('this is my req.bodaayy', req.body);
  const { name, username, password, zipcode, email } = req.body;

  try {
    const _user = await getUserByUsername(username);

    if (_user) {
      next({
        name: 'UserExistsError',
        message: `User ${username} is already taken.`,
      });
    } else if (password.length < 8) {
      next({
        name: 'PasswordLengthError!',
        message: 'Password too short!',
      });
    } else {
      const user = await createUser({
        username,
        password,
        name,
        zipcode,
        email,
      });
      if (!user) {
        next({
          name: 'NoUserExistsError',
          message: 'No such user exits.',
        });
      } else {
        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: '1w',
          }
        );

        res.send({
          message: 'Thanks for signing up!',
          user,
          token,
        });
      }
    }
  } catch (error) {
    next(error);
  }
});

//LOGIN
usersRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await getUserByUsername(username);
    const hashedPassword = user.password;
    const match = await bcrypt.compare(password, hashedPassword);
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET
    );

    if (user && match) {
      res.send({
        message: "You're logged in!",
        token: token,
        user: user,
      });
    } else {
      next({
        name: 'Bad Login',
        message: 'Username or password is incorrect',
      });
    }
  } catch (error) {
    next(error);
  }
});

// GET api/users/me
usersRouter.get('/me', async (req, res, next) => {
  try {
    const me = req.user;
    res.send(me);
  } catch (error) {
    next(error);
  }
});

// Make for later!
// usersRouter.get('/:username/services', )

module.exports = usersRouter;
