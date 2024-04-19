const parentModule  = require('parent-module');
import { log } from '../log';

export const system = function(f: Function) {

  let parentPath = parentModule();
  let main = require.main as NodeModule;

  if (main.filename === parentPath) {
    log.info('rabbi.system.start');
    f();
  }

  return f;
}
