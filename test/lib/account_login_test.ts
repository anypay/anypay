require("dotenv").config();


import {withEmailPassword} from '../../lib/account_login';
import {registerAccount} from '../../lib/accounts';

import { expect, chance } from '../utils'

describe('Account Login', () => {

  describe("registering an account", () => {
  
    it('#registerAccount should create a new account', async () => {

      let email = chance.email();
      let password = chance.word();

      let account = await registerAccount(email, password);

      expect(account.id).to.be.a('number');

      expect(account.email).to.be.equal(email);

      expect(account.get('password')).to.be.not.equal(password)
    });
    
  });

  it("#withEmailPassword should automatically downcase an email", async () => {

    let email = chance.email();

    let password = chance.word();

    let account = await registerAccount(email, password);

    let token = await withEmailPassword(email.toUpperCase(), password);

    expect(token.get('account_id')).to.be.equal(account.id)

    expect(token.id).to.be.a('number')
  });

  it("#withEmailPassword should fail with an invalid password", (done) => {

    let email = chance.email();

    let password = chance.word();

    registerAccount(email, password).then(() => {

      return withEmailPassword(email, 'invalidBADPASSword')

    })
    .catch(error => {

      console.log('CAUGHT', error)

      expect(error.message).to.be.a('string')

      done()

    })

  });

  it("#withEmailPassword should fail with an invalid email", (done) => {

    withEmailPassword('bad email', 'invalidBADPASSword').catch(error => {

      expect(error.message).to.be.a('string')

      done()

    })

  });

});
