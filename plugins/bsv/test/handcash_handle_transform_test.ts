import * as assert from 'assert';

import { transformAddress } from '../';

describe('Transforming Handcash Handle into BSV address', () => {

  it('should correctly tranform $spacedisco', async () => {

    const expectedAddress = '19aWuGr6ETwi9ha3vA22sj6872EwvjCwfQ';

    const handle = '$spacedisco';

    let address = await transformAddress(handle);

    assert.strictEqual(expectedAddress, address);

  });

});

