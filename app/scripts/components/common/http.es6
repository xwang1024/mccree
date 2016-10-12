'use strict';

exports.getResult = function(url, queryData, successCb, errorCb) {
  $.ajax({
    type: "get",
    data: queryData,
    dataType: 'json',
    url: url,
    success: (data) => {
      successCb(data["result"]);
    },
    error: errorCb
  });
}

exports.get = function(url, queryData, successCb, errorCb) {
  $.ajax({
    type: "get",
    data: queryData,
    dataType: 'json',
    url: url,
    success: successCb,
    error: errorCb
  });
}