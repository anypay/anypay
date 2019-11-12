
import * as Hapi from 'hapi';

import { Request } from 'hapi';

import { models, ambassadors } from '../../../lib';

export async function index(req: Request) {

  let ambassadors = await models.Ambassador.findAll();

  return { ambassadors };

};

