'use strict';

const express = require('express');

const errorHandler = require('./middleware/500.js');
const notFoundHandler = require('./middleware/404.js');

const app = express();
app.use(express.json());


// const categoryRouter = require('./categories.js');
// const productRouter = require('./products.js');


//middle ware
//const requestTime = require('../../middleware/timestamp.js');


// app.use('api/v2', categoryRouter);
// app.use(productRouter);

app.use('*', notFoundHandler);
app.use(errorHandler);


module.exports = {
  server: app,
  start: port => {
    const PORT = port || process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  },
};