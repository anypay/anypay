import { database } from '../../../lib';

import { Request, ResponseToolkit } from 'hapi';

export async function list(req: Request, h: ResponseToolkit) {

  let resp = await database.query(`select physical_address, business_name,
    latitude, longitude from accounts where physical_address is not null and
    business_name is not null`);

  return { merchants: resp[0] };

}
