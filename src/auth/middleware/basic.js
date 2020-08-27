'use strict';

const base64 = require('base-64');

const User = require('../models/users-model.js');

module.exports = async (req, res, next) => {

  const errorObj = { status: 401, statusMessage: 'Unauthorized', message:'Invalid'}

  if (!req.headers.authorization) { next('Invalid Login'); return; }

 
  let encodedPair = req.headers.authorization.split(' ').pop();

  // decodes to user:pass and splits it to an array
  let [user, pass] = base64.decode(encodedPair).split(':');

  // Is this user ok?

  try {
    const validUser = await User.authenticateBasic(user, pass);

    req.token = validUser.generateToken();
    next();
  } catch (err) {
    next(errorObj);

  }
  // users.authenticateBasic(user, pass)
  //   .then(validUser => {
  //     req.token = users.generateToken(validUser);
  //     next();
  //   })
  //   .catch(err => next('Invalid Login'));

};