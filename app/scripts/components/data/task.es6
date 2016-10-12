'use strict';

const urlPrefix = '/Home';
const http = require('components/common/http');

exports.getMyRefreshedTask = function(moneyTaskId, successCb, errorCb) {
  var url = `${urlPrefix}/Task/refreshMyTask`;
  http.getResult(url, { id: moneyTaskId }, successCb);
}