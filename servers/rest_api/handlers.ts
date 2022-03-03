
import { requireHandlersDirectory } from '../../lib/rabbi_hapi';

import { join } from 'path';

const handlers = requireHandlersDirectory(join(__dirname, './handlers'));

const v1 = requireHandlersDirectory(join(__dirname, '../v1/handlers'))

export { handlers, v1 }



