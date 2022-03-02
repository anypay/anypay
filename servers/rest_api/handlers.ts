
import { requireHandlersDirectory } from '../../lib/rabbi_hapi';

import { join } from 'path';

const handlers = requireHandlersDirectory(join(__dirname, './handlers'));

export { handlers }


