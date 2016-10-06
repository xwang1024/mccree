'use strict';

// marko渲染框架注入node内核
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
const config       = require('./lib/config');
const route        = require('./lib/route');
const cacheMgr     = require('./lib/cache_manager');

global.__rootpath = path.resolve(__dirname);

var app = express();
app.config = config;
app.cacheMgr = cacheMgr;

app.use(express.static('public')); // 静态文件
app.use(morgan('dev')); // http访问日志
app.use(session({ resave: true, saveUninitialized: true, secret: 'scvkj3lnfsdoi4hef' })); // session配置

route.initRenderRoutes(app, config.render); // 初始化渲染路由
route.initRedirectRoutes(app, config.redirect); // 初始化跳转路由
route.initOtherRoutes(app); // 初始化其他路由

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