'use strict';

const urlPrefix = '/Home';
const http = require('components/common/http');

exports.getUnReadAnnounceNum = function(successCb, errorCb) {
  var url = `${urlPrefix}/Announce/getUnReadAnnounceNum`;
  http.getResult(url, {}, successCb);
}