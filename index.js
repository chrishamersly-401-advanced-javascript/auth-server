'use strict';

const mongoose = require('mongoose');
const server = require('./src/server/server');

const MONGODB_URI = 'mongodb://localhost:27017/users';

const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

mongoose.connect(MONGODB_URI, mongooseOptions);

server.start(3000);