'use strict';

const express = require('express');
const router = express.Router();
const User = require('./models/users-model.js');
const oauth = require('./middleware/oauth.js');
const basicAuth = require('./middleware/basic.js');
const bearer = require('./middleware/bearer.js');
const permissions = require('./middleware/acl.js');


router.post('/signup', async (req, res, next)  => {
  const user = await User.create(req.body);
  const token = user.generateToken();
  const responseBody = {
    token,
    user,
  };
  res.send(responseBody);
});

router.post('/signin', basicAuth, (req, res, next) => {
  res.cookie('auth', req.token);
  res.set('token', req.token);
  res.send({
    token: req.token, 
    user: req.user,
  });
});


router.get('/oauth', oauth, (req, res) => {
  console.log('in get route for oauth');
  res.status(200).send(req.token);
});

router.get('/users', basicAuth, (req, res) => {
  res.status(200).json(User.list());
});

router.get('/secret', bearer, (req,res) => {
  res.status(200).send('access allowed');
} );

router.get('/public', routeHandler);
router.get('/private', bearer, routeHandler);
router.get('/readonly', bearer, permissions('read'), routeHandler);
router.post('/create', bearer, permissions('create'), routeHandler);
router.put('/update', bearer, permissions('update'), routeHandler);
router.delete('/delete', bearer, permissions('delete'), routeHandler);

function routeHandler(req, res) {
  res.status(200).send('Access Granted');
}
module.exports = router;
