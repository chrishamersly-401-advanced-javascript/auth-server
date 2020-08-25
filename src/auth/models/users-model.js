'use strict';
//take advantage of hooks within mongoose.

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = new mongoose.Schema({
  username: { type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String},
  role: {type: String, required: true, default:'username', enum: ['admin', 'editor', 'user']},
});

// how to modify user instance BEFORE saving??
users.pre('save', async function() {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});


//static
users.statics.authenticateBasic = function (username, password) {
  let query = {username};
  return this.findOne(query)
    .then(user => user && user.comparePassword(password))
    .catch(console.error);
};

//because its tied to a particular user. 
users.methods.comparePassword = function(plainPassword) {
  return bcrypt.compare(plainPassword, this.password)
    .then(valid => valid ? this:null);
};

//adding a method to a model
users.methods.generateToken = function () {
//grab token generation from app.js
  let tokenData = {
    id: this._id,
  };
  const signed = jwt.sign(tokenData, process.env.SECRET);

  return signed;
};


module.exports = mongoose.model('users', users);

//this will get hooked up the same way the rest of the way the other models were hooked up.