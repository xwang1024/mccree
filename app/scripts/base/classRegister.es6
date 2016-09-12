'use strict';
var _class = {};
class DyClass {
  constructor (className, opts) {
    if(!_class[className]) throw new Error(`Class ${className} is not defined！`);
    return new _class[className](opts);
  }
}
window.registerClass = (className, clazz) => {
  if(_class[className]) throw new Error(`Class ${className} is already existed！`);
  _class[className] = clazz;
}