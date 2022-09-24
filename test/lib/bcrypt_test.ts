
import { expect } from '../utils'

import { hash, compare } from '../../lib/bcrypt'

describe('lib/bcrypt', () => {

  it('#compare should approve a valid password', async () => {

    const password = 'password'

    const passwordHash = await hash(password)

    const valid = await compare(password, passwordHash)

    expect(valid).to.be.true

  })

  it('#compare should reject an invalid password', async () => {

    const password = 'password'

    const passwordHash = await hash(password)

    const valid = await compare('invalid', passwordHash)

    expect(valid).to.be.false

  })

  it('#hash should hash a string', async () => {

    const password = 'password'

    const passwordHash = await hash(password)

    expect(passwordHash).to.be.a('string')

  })

  it('#hash should reject an empty string', async () => {

    var password: string;

    expect(
        hash(password)
    )
    .to.be.eventually.rejected

  })


})
