'use strict';

// Install marko node requirements
require('marko/express');
require('marko/node-require').install();
require('marko/hot-reload').enable();

const _            = require('lodash');
const watchTree    = require("fs-watch-tree").watchTree;
const path         = require('path');
const http         = require('http');
const express      = require('express');
const logger       = require('morgan');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const session      = require('express-session');
const async        = require('async');
const request      = require('request');
const qs           = require('querystring');

const phpHost      = 'http://localhost';

var app = express();

app.use(express.static('public'));
app.use(logger('dev'));

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'scvkj3lnfsdoi4hef'
}));

const serviceConfs = require('./conf/service.json');
const renderConfs = require('./conf/render.json');

for(var url in renderConfs) {
  (function(url, renderConf) {
    // 登录用户检测
    app.get(url, (req, res, next) => {
      if(req.session.user) return next();
      console.log("[REQUEST] Current User")
      request.get({
        url: phpHost + '/Home/User/getMyInfo',
        headers: req.headers
      }, (err, response, body) => {
        if (!err && response.statusCode == 200) {
          var data = {};
          try {
            data = JSON.parse(body);
          } catch(e) {
            console.log(e.message)
          }
          data.result && (req.session.user = data.result);
        }
        next();
      });
    });

    app.get(url, (req, res, next) => {
      let template = require(renderConf.view);
      // get data from PHP Server
      var dataKeys = Object.keys(renderConf.data);
      var context = {};
      async.each(dataKeys, (dataKey, callback) => {
        let serviceName = renderConf.data[dataKey];
        let query = {};
        let isGlobal = false;
        if(typeof(serviceName) === 'object') {
          isGlobal    = serviceName.global;
          query       = _.assign({}, serviceName.query);
          serviceName = serviceName.service;

          for(let k in query) {
            if(query[k].indexOf('$') === 0 && req.params[query[k].slice(1)]) {
              query[k] = req.params[query[k].slice(1)];
            }
          }
        }
        let service = serviceConfs[serviceName];
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
            var data = {};
            try {
              data = JSON.parse(body);
            } catch(e) {
              console.log(body);
              console.log(e.message)
            }
            context['$global'] = { user: req.session.user };
            if(isGlobal) {
              context['$global'] || (context['$global']={});
              context['$global'][dataKey] = data;
            } else {
              context[dataKey] = data;
            }
          } else {
            console.log(err);
          }
          callback();
        });
      }, (err) => {
        try {
          console.log('global', context['$global']);
          context['_path_']   = req.path;
          context['_params_'] = req.params;
          context['_query_'] = req.query;
          res.marko(template, context);
        } catch(e) {
          res.send(e.stack)
        }
        
      });
    });
  })(url, renderConfs[url]);
}

app.all('/*', (req, res, next) => {
  var url = phpHost+req.originalUrl;
  // 删除session中的用户
  if(req.path.indexOf('/logout') >= 0 ) delete req.session.user;
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