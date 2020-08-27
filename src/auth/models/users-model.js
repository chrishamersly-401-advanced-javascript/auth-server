'use strict';
//take advantage of hooks within mongoose.
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = new mongoose.Schema({
  username: { type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String},
  role: {type: String, default:'username', enum: ['admin', 'editor', 'user']},
});

users.pre('save', async function() {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});


//static
users.statics.authenticateBasic = async function (username, password) {
  const user = await this.findOne({username});
  return user && await user.comparePassword(password);
};

//because its tied to a particular user. 
users.methods.comparePassword = async function(password) {
  const passwordMatch = await bcrypt.compare(password, this.password);
  return passwordMatch ? this : null; 
};

//adding a method to a model
users.methods.generateToken = function () {
  const payload = {
    role: this.role,
  };
  return jwt.sign(payload, process.env.JWT_SECRET);
};

users.statics.createFromOauth = async function (email) {
  
  if (!email) {
    return Promise.reject('Validation Error');
  }

  const user = await this.findOne({ email });

  // if(!email) {
  //   throw new Error ('Validation Error');
  // }

  if(user) {
    return user;
  }
  else {
    return this.create({ 
      username: email, 
      password: 'none', 
      email: email});
  }

};
//check to see if user is truthy



module.exports = mongoose.model('users', users);

