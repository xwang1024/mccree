String.prototype.getQuery = function(name){
  var reg = new RegExp(name + '=".*?"');
  var result = this.match(reg)[0];
  result = result.substr(name.length+2);
  return result.substr(0,result.length-1);
};