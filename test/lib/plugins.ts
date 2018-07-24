import {plugins} from '../../lib/plugins';
import * as assert from 'assert';

describe("Plugins", () => {

  it('should load all the plugins', async () => {

    console.log('plugins', plugins);

    let plugin = await plugins.findForCurrency('BCH');

    assert.strictEqual(plugin.currency, 'BCH');

  });

})

