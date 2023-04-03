require("dotenv").config();

import {plugins} from '../../lib/plugins';
import * as assert from 'assert';

describe("Plugins", () => {

  it('should load all the plugins', async () => {

    let plugin = await plugins.findForChain('BCH');

    assert.strictEqual(plugin.currency, 'BCH');

  });

})

