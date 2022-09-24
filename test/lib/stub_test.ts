
import { assert } from '../utils'

import * as stub from '../../lib/stub'

describe("Adding a stub to an account", () => {

  it("should use the business name by default", () => {

    var accountStub = stub.build({ business_name: 'La Carreta' })

    assert.strictEqual(accountStub, 'la-carreta')

    accountStub = stub.build({
      business_name: 'La Carreta',
      city: 'Portsmouth'
    })

    assert.strictEqual(accountStub, 'la-carreta-portsmouth')

  })

})
