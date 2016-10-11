'use strict';

const _       = require('lodash');
const async   = require('async');
const request = require('request');
const qs      = require('querystring');
const config  = require('../config');

// 处理url中的参数
function resolveUrlParams(url, params) {
  url = String(url);
  for(let k in params) {
    url = url.replace(`$${k}`, req.params[k]);
  }
  return url;
}

// 获取用户信息
function getUserInfo(headers, callback) {
  request.get({
    url: config.backend.host + '/Home/User/getMyInfo',
    headers: _.pick(headers, ['user-agent', 'cookie'])
  }, (err, response, body) => {
    if (!err && response.statusCode == 200) {
      var data = {};
      try {
        data = JSON.parse(body);
      } catch(e) { callback(e); }
      return callback(err, data.result || undefined);
    } else {
      return callback(err || new Error(`HTTP Status ${response.statusCode}`));
    }
  });
}

// 初始化跳转路由
exports.initRedirectRoutes = function(app, redirectConfig) {
  for(var url in redirectConfig) {
    ((url, redirectConf) => { // 将参数以形参的形式传入，避免内部异步执行可能造成的问题
      app.get(url, (req, res, next) => {
        let url = resolveUrlParams(redirectConf.redirect, req.params);
        console.log(`[REDIRECT] ${url}`);
        return res.redirect(url);
      });
    })(url, redirectConfig[url]);
  }
}

// 初始化渲染路由
exports.initRenderRoutes = function(app, renderConfig) {
  for(var url in renderConfig) {
    (function(url, renderConf) { // 将参数以形参的形式传入，避免内部异步执行可能造成的问题
      // 向后台获取用户信息
      app.get(url, (req, res, next) => {
        // 用户已登录
        if(req.session.user) return next();
        // 用户未登录，连接后台检查cookies
        console.log("[AUTH CHECK]");
        getUserInfo(req.headers, (err, userInfo) => {
          if(err) return console.log(err);
          console.log("[LOGIN USER]", userInfo);
          req.session.user = userInfo;
          return next();
        });
      });

      // ifLogin 和 ifNotLogin 检查
      app.get(url, (req, res, next) => {
        // ifNotLogin 检查：没有登录 -> 跳转
        if(renderConf.ifNotLogin && !req.session.user) {
          let url = resolveUrlParams(renderConf.ifNotLogin, req.params);
          console.log(`[IF NOT LOGIN] ${url}`);
          return res.redirect(url);
        }
        // ifLogin 检查：配置了ifLogin，已登录，没有userId参数或该参数和已登录用户吻合 -> 跳转
        if(renderConf.ifLogin && req.session.user && (!req.params.userId || parseInt(req.params.userId) == parseInt(req.session.user.id))) {
          let url = resolveUrlParams(renderConf.ifLogin, req.params);
          console.log(`[IF LOGIN] ${url}`);
          return res.redirect(url);
        }
        return next();
      });

      // 获取数据并渲染
      app.get(url, (req, res, next) => {
        let template = require(__rootpath + renderConf.view);
        var dataKeys = Object.keys(renderConf.data || {});
        var context = { '$global': { user: req.session.user } };
        async.each(dataKeys, (dataKey, callback) => {
          let dataConf = renderConf.data[dataKey];
          let serviceName;
          let query = {};
          let isGlobal = false;
          if(typeof(dataConf) === 'object') {
            isGlobal    = dataConf.global;
            query       = _.assign({}, dataConf.query);
            serviceName = dataConf.service;
            for(let k in query) {
              if(typeof query[k] === 'string' && query[k].indexOf('$') === 0 && req.params[query[k].slice(1)]) {
                query[k] = req.params[query[k].slice(1)];
              }
            }
          } else {
            serviceName = dataConf;
          }

          function resolveBody(body) {
            var data = {};
            try {
              data = JSON.parse(body);
            } catch(e) {
              console.log('[Body]', body);
              console.log('[ERROR]', e.message)
            }
            if(isGlobal) {
              context['$global'] || (context['$global']={});
              context['$global'][dataKey] = data;
            } else {
              context[dataKey] = data;
            }
          }
          // 缓存加载
          if(typeof(dataConf) === 'object' && dataConf.cache) {
            console.log("[FROM CACHE] " + dataConf.cacheKey || dataConf.service);
            return app.cacheMgr.getCache(dataConf.cacheKey || dataConf.service, (err, data) => {
              if(err) return callback(err);
              resolveBody(data);
              callback();
            });
          }
          // 后台加载
          let service = config.backend.services[serviceName];
          if(!service) {
            console.log(`${serviceName} not defined`);
            return callback();
          }
          console.log("[REQUEST] " + config.backend.host+service.url + '?' + qs.stringify(query))
          request[service.method]({
            url: config.backend.host+service.url,
            headers: _.pick(req.headers, ['user-agent', 'cookie']),
            qs: query
          }, (err, response, body) => {
            if (!err && response.statusCode == 200) {
              resolveBody(body);
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
    })(url, renderConfig[url]);
  }
}

// 其他路由作为代理穿透，登出操作清除session
exports.initOtherRoutes = function(app) {
  app.all('/*', (req, res, next) => {
    let url = config.backend.host + req.originalUrl;
    // 删除session中的用户
    if(req.path.indexOf('/logout') >= 0 ) delete req.session.user;
    req.pipe(request(url)).pipe(res);
  });
}


