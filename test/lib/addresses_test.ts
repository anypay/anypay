
import { account, createAccount, expect } from '../utils'

import { findOne } from '../../lib/orm';

import { listAddresses, lockAddress, unlockAddress, setAddress, Address, findAddress, AddressNotFound, removeAddress } from '../../lib/addresses';

describe('Addresses Library', () => {

  it("should lock and unlock an address", async () => {

    let currency = 'DASH'

    var address: Address = await setAddress(account, {
      currency,
      value: 'XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9'
    })

    expect(address.id).to.be.a('number');

    expect(address.get('locked')).to.be.equal(false);

    await lockAddress(account, currency);

    address = await findOne<Address>(Address, { where: { id: address.id }})

    expect(address.get('locked')).to.be.equal(true);

    await unlockAddress(account, currency);

    address = await findOne<Address>(Address, { where: { id: address.id }})

    expect(address.get('locked')).to.be.equal(false);

  });

  it("#setAddress should set the address for an account", async () => {

    const address = await setAddress(account, {
      currency: 'DASH',
      value: 'XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9'
    })

    expect(address.get('currency')).to.be.equal('DASH')

    expect(address.get('value')).to.be.equal('XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9')

  })

  it("#listAddresses should return coins for an account", async () => {

    const account = await createAccount()

    await setAddress(account, {
      currency: 'DASH',
      value: 'XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9'
    })

    const coins = await listAddresses(account)

    expect(coins).to.be.an('array')

  })

  describe("#findAddress", () => {

    it('should throw AdressNotFound if no address is set', async () => {

      const account = await createAccount()

      expect(
        findAddress(account, 'DOGE')
      )
      .to.eventually.be.rejectedWith(new AddressNotFound(account, 'DOGE'))
    })

  })

  describe("#removeAddress", () => {

    it('should remove an address if one is set', async () => {

      const account = await createAccount()

      await setAddress(account, {
        currency: 'DASH',
        value: 'XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9'
      })

      const address = await findAddress(account, 'DASH')

      expect(address.get('currency')).to.be.equal('DASH')

      await removeAddress(account, 'DASH')

      expect(
        findAddress(account, 'DASH')
      )
      .to.eventually.be.rejectedWith(new AddressNotFound(account, 'DASH'))

    })

  })

  describe('#lockAddress', () => {

    it('should fail if the address is not found', async () => {

      const account = await createAccount()

      expect(

        lockAddress(account, 'DASH')

      )
      .to.eventually.be.rejected

    })

  })

  describe('#unlockAddress', () => {

    it('should fail if the address is not found', async () => {

      const account = await createAccount()

      expect(

        unlockAddress(account, 'DASH')

      )
      .to.eventually.be.rejected

    })
  })

  describe('#removeAddress', () => {

    it('should fail if the address is not found', async () => {

      const account = await createAccount()

      expect(

        removeAddress(account, 'DASH')

      )
      .to.eventually.be.rejected

    })
  })

});
