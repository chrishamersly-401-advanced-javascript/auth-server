'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let SECRET = process.env.JWT_SECRET;

let db = {};

let users = {};

// Because we're using async bcrypt, this function needs to return a value or a promise rejection
users.save = async function (record) {

  if (!db[record.username]) {
    
    record.password = await bcrypt.hash(record.password, 5);

    
    db[record.username] = record;

    return record;

  }

  return Promise.reject();
};


users.authenticateBasic = async function (user, pass) {
  let valid = await bcrypt.compare(pass, db[user].password);
  return valid ? db[user] : Promise.reject();
};

users.generateToken = function (user) {
  let token = jwt.sign({ username: user.username }, SECRET);
  return token;
};

users.list = () => db;

module.exports = users;