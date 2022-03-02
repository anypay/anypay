
import * as assert from 'assert';
import { generateAdminToken, verifyToken } from '../../lib/jwt';

describe("JWT Authentication", () => {

  it('#generateAdminToken should sign a token with admin=true', async () => {

    let token = await generateAdminToken();

    let legit = await verifyToken(token);

    assert.strictEqual(legit.admin, true);
    assert.strictEqual(legit.aud, 'https://anypayx.com');
    assert.strictEqual(legit.iss, 'anypayx.com');
    assert.strictEqual(legit.sub, 'auth@anypayx.com');
    assert(legit.iat);
    assert(legit.exp);
  });

  it('#verifyToken should fail on an invalid token', async () => {;

    let token = await generateAdminToken();

    let invalidToken = token.substring(0, token.length - 3); // remove last three bytes

    try {

      let legit = await verifyToken(invalidToken);

      assert(false, 'token should not be verified');

    } catch(error) {

      assert.strictEqual(error.message, 'invalid signature');

    }

  });

})
