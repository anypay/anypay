
import { account, expect } from '../utils'

import { createApp, findOne, findApp } from '../../lib/apps'

describe('lib/apps', () => {

  it('#findApp should return the app by id', async () => {

    let app = await createApp({
        name: 'my-best-app',
        account_id: account.id
    })

    app = await findOne(app.id)

    app = await findApp(app.id)

    expect(app.get('name')).to.be.equal('my-best-app')

  })

})
 