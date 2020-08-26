'use strict';

const express = require('express');
const router = express.Router();
const auth = require('./middleware/oauth.js');
const users = require('./models/users-model.js');
const oauth = require('./middleware/oauth.js');
const basicAuth = require('./middleware/basic.js');
// const express = require('express');



router.post('/signup', (req, res, next)  => {
  const user = new users(req.body);

  user.save()
    .then(user => {
      let token = user.generateToken(user);
      res.status(200).send(token);
    })
    .catch(e => {
      console.error(e);
      res.status(403).send('Error Creating User');
    });
});

router.post('/signin', auth, (req, res, next) => {


  res.cookie('auth', req.token);
  res.send(req.token);

  // res.send({
  //   token: req.token, 
  //   user: req.user,
});

router.use('/', (req, res) => {
  res.render('../../public/index.html');
});

router.get('/oauth', oauth, (req, res) => {
  res.status(200).send(req.token);
});


router.get('/users', basicAuth, (req, res) => {
  res.status(200).json(users.list());
});

module.exports = router;