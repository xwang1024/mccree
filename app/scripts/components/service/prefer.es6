'use strict';

const urlPrefix = '/Home';
const http = require('components/common/http');

exports.getPreferResources = function(num, successCb, errorCb) {
  var url = `${urlPrefix}/Prefer/getReResource`;
  http.get(url, { num: num }, successCb);
}