'use strict';

// Install marko node requirements
require('marko/express');
require('marko/node-require').install();

const http       = require('http');
const express    = require('express');
const logger     = require('morgan');
const bodyParser = require('body-parser');

var app = express();

app.use(logger('dev'));

app.get('/', (req, res, next) => {
  let template = require('./lib/views/index.marko');
  res.marko(template, {
    name: 'Frank',
    count: 30,
    colors: ['red', 'green', 'blue']
  });
});

app.server = http.createServer(app);
app.server.listen(3000, function(){
  console.log('Server is running on port 3000');
});