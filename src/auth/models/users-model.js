'use strict';
//take advantage of hooks within mongoose.
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

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
  let token = {
    id: this._id, 
    role: this.role,
  };
  let options = { };

  return jwt.sign(token, SECRET, options);
  
};

users.statics.createFromOauth = function (username) {

  if (!username) { return Promise.reject('Validation Error'); }

  return this.findOne({ username })
    .then(user => {
      if (!user) { throw new Error('User Not Found'); }
      console.log('Welcome Back', user.username);
      return user;
    })
    .catch(error => {
      console.log('Creating new user');
      let password = 'noteventrue';
      return this.create({ username, password });
    });

};



users.statics.authenticateToken = function (token) {
  let parsedToken = jwt.verify(token, SECRET);
  return this.findById(parsedToken.id);

};




module.exports = mongoose.model('users', users);

