'use strict';

// Install marko node requirements
require('marko/express');
require('marko/node-require').install();
require('marko/hot-reload').enable();

const _          = require('lodash');
const watchTree  = require("fs-watch-tree").watchTree;
const path       = require('path');
const http       = require('http');
const express    = require('express');
const logger     = require('morgan');
const bodyParser = require('body-parser');
const async      = require('async');
const request    = require('request');
const qs         = require('querystring');

const phpHost    = 'http://localhost';

var app = express();

app.use(express.static('public'));
app.use(logger('dev'));

const serviceConf = require('./conf/service.json');
const renderConf = require('./conf/render.json');
const forwardConf = require('./conf/forward.json');

for(var url in renderConf) {
  (function(url, conf) {
    app.get(url, (req, res, next) => {
      let template = require(conf.view);
      // get data from PHP Server
      var dataKeys = Object.keys(conf.data);
      var context = {};
      async.each(dataKeys, (dataKey, callback) => {
        let serviceName = conf.data[dataKey];
        let query = {};
        if(typeof(serviceName) === 'object') {
          query       = serviceName.query;
          serviceName = serviceName.service;
        }
        let service = serviceConf[serviceName];
        if(!service) {
          console.log(`${serviceName} not defined`);
          return callback();
        }
        console.log("[REQUEST] " + phpHost+service.url + '?' + qs.stringify(query))
        request[service.method]({
          url: phpHost+service.url,
          headers: req.headers,
          qs: query
        }, (err, response, body) => {
          if (!err && response.statusCode == 200) {
            context[dataKey] = JSON.parse(body);
          } else {
            console.log(err);
          }
          callback();
        });
      }, (err) => {
        res.marko(template, context);
      });
    });
  })(url, renderConf[url]);
}

app.all('/*', (req, res, next) => {
  var url = phpHost+req.originalUrl;
  req.pipe(request(url)).pipe(res);
});

app.server = http.createServer(app);
app.server.listen(3000, function(){
  console.log('Server is running on port 3000');
});

// var templatesDir = path.join(__dirname, 'lib/views');
watchTree("lib/views", function (event) {
    if (/\.marko$/.test(event.name)) {
        // Resolve the filename to a full template path:
        var templatePath = path.join(__dirname, event.name);

        console.log('Marko template modified: ', templatePath);

        // Pass along the *full* template path to marko
        require('marko/hot-reload').handleFileModified(templatePath);
    }
});