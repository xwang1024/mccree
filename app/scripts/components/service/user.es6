'use strict';

const urlPrefix = '/Home';
const http = require('components/common/http');

exports.getBinds = function(successCb, errorCb) {
  var url = `${urlPrefix}/User/getbinds`;
  http.getResult(url, {}, successCb);
}

exports.preLogin = function(successCb, errorCb) {
  var url = `${urlPrefix}/User/login`;
  $.ajax({
    type: "post",
    url: urlPrefix + "/User/login",
    async: true,
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      if (XMLHttpRequest.status == "401") {
        var auth = XMLHttpRequest.getResponseHeader("WWW-Authorization");
        successCb(auth.getQuery("nonce"), auth.getQuery("realm"), auth.getQuery("opaque"));
      } else {
        errorCb();
      }
    }
  });
}

exports.login = function(Authorization, successCb, errorCb) {
  var url = `${urlPrefix}/User/login`;
  $.ajax({
    type: "post",
    url: urlPrefix + "/User/login",
    async: false,
    headers: {
      Authorization: Authorization
    },
    success: successCb,
    error: errorCb
  });
}