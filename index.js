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
  let template = require('./lib/views/pages/index.marko');
  res.marko(template, {});
});

app.server = http.createServer(app);
app.server.listen(3000, function(){
  console.log('Server is running on port 3000');
});

var templatesDir = path.join(__dirname, 'lib/views');
watchTree("lib/views", function (event) {
    if (/\.marko$/.test(event.name)) {
        // Resolve the filename to a full template path:
        var templatePath = path.join(templatesDir, event.name);

        console.log('Marko template modified: ', templatePath);

        // Pass along the *full* template path to marko
        require('marko/hot-reload').handleFileModified(templatePath);
    }
});