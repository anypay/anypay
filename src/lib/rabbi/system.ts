const parentModule  = require('parent-module');
import { log } from '@/lib/log';

export const system = function(f: any) {

  let parentPath = parentModule();
  let main = require.main;

  if (main?.filename === parentPath) {
    log.info('rabbi.system.start');
    f();
  }

  return f;
}
