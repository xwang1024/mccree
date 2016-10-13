'use strict';

const urlPrefix = '/Home';
const http = require('components/common/http');

exports.getSearchHottestKeys = function(successCb, errorCb) {
  var url = `${urlPrefix}/Tag/searchHottestKeys`;
  http.get(url, {}, successCb);
}