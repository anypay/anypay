require('dotenv').config();

import * as monthly from './monthly';
import * as db from '../database';

export async function totalMerchants(): Promise<number> {

  let result = await db.query('select count(*) from accounts');

  return parseInt(result[0][0].count);

}

export { monthly };

