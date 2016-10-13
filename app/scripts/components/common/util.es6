'use strict';

exports.htmlDecode = function htmlDecode(str) {
  var s = "";
  if (str.length == 0) return "";
  s = str.replace(/&lt;/g, "<");
  s = s.replace(/&gt;/g, ">");
  s = s.replace(/&nbsp;/g, "hi");
  s = s.replace(/&#39;/g, "\'");
  s = s.replace(/&quot;/g, "\"");
  //s = s.replace(/<br>/g, "\n");
  s = s.replace(/&amp;/g, "&");
  return s;
}


exports.htmlEncode = function htmlEncode(str){
  str = str.toString();
  str = str.replace(/</g, "&lt;");
  str = str.replace(/>/g, "&gt;");
  str = str.replace(/"/g, "&quot;");
  str = str.replace(/'/g, "&#39;");
  return str;
}