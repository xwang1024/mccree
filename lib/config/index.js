'use strict';

const YAML = require('yamljs');

const BACKEND_CONFIG_PATH   = './config/backend.yaml';
const RENDER_CONFIG_PATH    = './config/render.yaml';
const REDIRECT_CONFIG_PATH  = './config/redirect.yaml';

module.exports = {
  backend:  YAML.load(BACKEND_CONFIG_PATH),
  render:   YAML.load(RENDER_CONFIG_PATH),
  redirect: YAML.load(REDIRECT_CONFIG_PATH),
}