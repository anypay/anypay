
import { requireHandlersDirectory } from '../lib/rabbi_hapi';

import { join } from 'path';

const v0 = requireHandlersDirectory(join(__dirname, './v0/handlers'));

const v1 = requireHandlersDirectory(join(__dirname, './v1/handlers'))

const jsonV2 = requireHandlersDirectory(join(__dirname, './jsonV2/handlers'))

export { v0, v1, jsonV2 }



