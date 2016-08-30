'use strict';

// Install marko node requirements
require('marko/express');
require('marko/node-require').install();
require('marko/hot-reload').enable();

const watchTree  = require("fs-watch-tree").watchTree;
const path       = require('path');
const http       = require('http');
const express    = require('express');
const logger     = require('morgan');
const bodyParser = require('body-parser');

var app = express();

app.use(express.static('public'));
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

// watchTree("lib/views", function (event) {
//   var layoutFiles = ['lib/views/index.marko'];
//   if (/\.marko$/.test(event.name)) {
//     require('marko/hot-reload').handleFileModified('./'+event.name);
//   }
// });
var templatesDir = path.join(__dirname, 'lib/views');
require('fs').watch(templatesDir, function (event, filename) {
    if (/\.marko$/.test(filename)) {
        // Resolve the filename to a full template path:
        var templatePath = path.join(templatesDir, filename);

        console.log('Marko template modified: ', templatePath);

        // Pass along the *full* template path to marko
        require('marko/hot-reload').handleFileModified(templatePath);
    }
});