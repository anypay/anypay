const parentModule  = require('parent-module');
import { log } from '../logger';

export const system = function(f) {

  let parentPath = parentModule();
  let main = require.main;

  if (main.filename === parentPath) {
    log.info('rabbi.system.start');
    f();
  }

  return f;
}
