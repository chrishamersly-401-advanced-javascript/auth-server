'use strict';


const express = require('express');

// const users = require('./auth/middleware/users.js');
// const basicAuth = require('./auth/middleware/basic.js');
// const oauth = require('./auth/middleware/oauth.js');

const errorHandler = require('./middleware/500.js');
const notFoundHandler = require('./middleware/404.js');
const router = require('./auth/router.js');

const app = express();

app.use(express.static('../public'));
app.use(express.json());
app.use(router);

app.use('*', notFoundHandler);
app.use(errorHandler);


module.exports = {
  server: app,
  start: port => {
    const PORT = port || process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  },
};