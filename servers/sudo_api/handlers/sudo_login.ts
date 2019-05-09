
import { Request, ResponseToolkit } from 'hapi';

import { log } from '../../../lib';

export async function sudoLogin(req: Request, h: ResponseToolkit) {

  log.info('sudo.login');

  return h.response({ success: true }).code(200);

}
