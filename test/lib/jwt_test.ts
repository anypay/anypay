
import * as assert from 'assert';
import { generateAdminToken, verifyToken } from '../../lib/jwt';

import { config } from '../../lib/config' 

describe("JWT Authentication", () => {

  it('#generateAdminToken should sign a token with admin=true', async () => {

    let token = await generateAdminToken();

    let legit = await verifyToken(token);

    assert.strictEqual(legit.admin, true);
    assert.strictEqual(legit.aud, `https://${config.get('DOMAIN')}`);
    assert.strictEqual(legit.iss, config.get('DOMAIN'));
    assert(legit.iat);
    assert(legit.exp);
  });

  it('#verifyToken should fail on an invalid token', async () => {

    let token = await generateAdminToken();

    let invalidToken = token.substring(0, token.length - 3); // remove last three bytes

    try {

      await verifyToken(invalidToken);

      assert(false, 'token should not be verified');

    } catch(error) {

      assert.strictEqual(error.message, 'invalid signature');

    }

  });

})
