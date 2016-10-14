'use strict';

const urlPrefix = '/Home';
const http = require('components/common/http');

exports.getUnreadCommentNum = function(successCb, errorCb) {
  var url = `${urlPrefix}/Comment/getUnreadCommentNum`;
  http.getResult(url, {}, successCb);
}

exports.getUnReadPraiseNum = function(successCb, errorCb) {
  var url = `${urlPrefix}/Comment/getUnReadPraiseNum`;
  http.getResult(url, {}, successCb);
}