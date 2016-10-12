'use strict';

const urlPrefix = '/Home';
const http = require('components/common/http');

exports.getBinds = function(successCb, errorCb) {
  var url = `${urlPrefix}/User/getbinds`;
  http.getResult(url, {}, successCb);
}