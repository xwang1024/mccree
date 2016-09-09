'use strict';

const request = require('request');
const host = require('../../conf/host').address;
const service = require('../../conf/service');

request(host + service.user_getMyInfo.path, function (err, response, body) {
  if (!err  && response.statusCode == 200) {
    console.log(body) 
  }
})