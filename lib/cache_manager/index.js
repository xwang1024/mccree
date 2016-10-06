'use strict';

const async   = require('async');
const request = require('request');
const qs      = require('querystring');
const redis   = require("redis");
const config  = require('../config');

let redisClient = redis.createClient({
  host: '127.0.0.1',
  port: 6379
});

redisClient.on("error", function (err) {
  console.log("Error " + err);
});

let cacheMap = {};
let taskItvMap = {};

function setCache(k, v) {
  let data = { value: v };
  redisClient.set(k, JSON.stringify(data));
}

function getCache(k, callback) {
  redisClient.get(k, (err, reply) => {
    if(err) return callback(err, reply);
    let data = JSON.parse(reply);
    callback(err, data.value);
  });
}

function register(method, url, query, key, expire) {
  if(cacheMap[key]) return console.log(`[ERROR] Duplicate key: ${key}`);
  cacheMap[key] = {
    method: method,
    url: url,
    query: query,
    key: key,
    expire: expire
  };
}

function updateAll(done) {
  async.each(Object.keys(cacheMap), (key, callback) => {
    let cacheConf = cacheMap[key];
    console.log("[REQUEST] " + cacheConf.url + '?' + qs.stringify(cacheConf.query))
    request[cacheConf.method]({
      url: cacheConf.url,
      qs: cacheConf.query
    }, (err, response, body) => {
      if (!err && response.statusCode == 200) {
        setCache(key, body);
        console.log("[CACHE UPDATED] " + key);
      } else {
        console.log(err);
      }
      callback();
    });
  }, done);
}

function update(key, done) {
  let cacheConf = cacheMap[key];
  console.log("[REQUEST] " + cacheConf.url + '?' + qs.stringify(cacheConf.query))
  request[cacheConf.method]({
    url: cacheConf.url,
    qs: cacheConf.query
  }, (err, response, body) => {
    if (!err && response.statusCode == 200) {
      setCache(key, body);
      console.log("[CACHE UPDATED] " + key);
    } else {
      console.log(err);
    }
    if(done) return done();
  });
}

function startUpdateTask() {
  for(var k in cacheMap) {
    (function(key, cacheConf) {
      taskItvMap[key] = setInterval(function() {
        update(key);
      }, cacheConf.expire);
    })(k, cacheMap[k]);
  }
}

exports.setCache        = setCache;
exports.getCache        = getCache;
exports.register        = register;
exports.update          = update;
exports.updateAll       = updateAll;
exports.startUpdateTask = startUpdateTask;