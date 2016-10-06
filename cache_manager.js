'use strict';

const path     = require('path');
const config   = require('./lib/config');
const cacheMgr = require('./lib/cache_manager');

global.__rootpath = path.resolve(__dirname);

if(!config.render) return console.log('[ERROR] render配置文件不存在');
// 注册
Object.keys(config.render).forEach((renderConfName) => {
  let renderConf = config.render[renderConfName];
  if(!renderConf.data) return;
  Object.keys(renderConf.data).forEach((dataConfName) => {
    let dataConf = renderConf.data[dataConfName];
    if(!dataConf.cache) return;
    let serviceConf = config.backend.services[dataConf.service];
    if(!serviceConf) return console.log(`[ERROR] ${dataConf.service} 服务不存在`);
    cacheMgr.register(serviceConf.method, config.backend.host + serviceConf.url, 
                      dataConf.query, dataConf.cacheKey || dataConf.service, 
                      dataConf.cacheExpire || 5000)
  });
});
// 初始化
cacheMgr.updateAll(() => {
  console.log('Cache init ok! Starting update task...');
  cacheMgr.startUpdateTask();
  console.log('Cache update task is running!');
});