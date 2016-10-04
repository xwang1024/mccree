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
const morgan       = require('morgan');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const session      = require('express-session');
const async        = require('async');
const request      = require('request');
const qs           = require('querystring');

const phpHost      = 'http://mebox.xin.me';

var app = express();

app.use(express.static('public'));
app.use(morgan('dev'));

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'scvkj3lnfsdoi4hef'
}));

const serviceConfs  = require('./conf/service.json');
const renderConfs   = require('./conf/render.json');
const redirectConfs = require('./conf/redirect.json');

let genHeader = function(req) {
  return {
    'user-agent': req.headers['user-agent'],
    'cookie': req.headers['cookie']
  }
}

for(var url in renderConfs) {
  (function(url, renderConf) {
    // 登录用户检测
    app.get(url, (req, res, next) => {
      var redirectCheck = function() {
        if(renderConf.ifLogin && req.session.user && parseInt(req.params.id) == parseInt(req.session.user.id)) {
          let url = renderConf.ifLogin+'';
          for(let k in req.params) url=url.replace('$' + k, req.params[k]);
          console.log(`[LOGIN REDIRECT] ${url}`);
          return res.redirect(url);
        }
        return next();
      }
      if(req.session.user) return redirectCheck();
      console.log("[REQUEST] " + phpHost + '/Home/User/getMyInfo');
      console.log("[headers] ", req.headers);
      request.get({
        url: phpHost + '/Home/User/getMyInfo',
        headers: genHeader(req)
      }, (err, response, body) => {
        console.log(body);
        if (!err && response.statusCode == 200) {
          var data = {};
          try {
            data = JSON.parse(body);
            console.log("[USER]", data);
          } catch(e) {
            console.log('[Error]', e.message);
          }
          data.result && (req.session.user = data.result);
        }
        return redirectCheck();
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
        console.log("[headers] ", req.headers);
        request[service.method]({
          url: phpHost+service.url,
          headers: genHeader(req),
          qs: query
        }, (err, response, body) => {
          if (!err && response.statusCode == 200) {
            var data = {};
            try {
              data = JSON.parse(body);
            } catch(e) {
              console.log('[Body]', body);
              console.log('[Error]', e.message)
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

for(var url in redirectConfs) {
  (function(url, redirectConf) {
    app.get(url, (req, res, next) => {
      let url = redirectConf.redirect+'';
      for(let k in req.params) url=url.replace('$' + k, req.params[k]);
      console.log(`[REDIRECT] ${url}`);
      return res.redirect(url);
    });
  })(url, redirectConfs[url]);
}
app.all('/*', (req, res, next) => {
  var url = phpHost+req.originalUrl;
  // 删除session中的用户
  if(req.path.indexOf('/logout') >= 0 ) delete req.session.user;
  req.pipe(request(url)).pipe(res);
});

app.server = http.createServer(app);
app.server.listen(4000, function(){
  console.log('Server is running on port 4000');
});

// 实时检测模板文件变更
watchTree("lib/views", function (event) {
  if (/\.marko$/.test(event.name)) {
    var templatePath = path.join(__dirname, event.name);
    console.log('Marko template modified: ', templatePath);
    require('marko/hot-reload').handleFileModified(templatePath);
  }
});