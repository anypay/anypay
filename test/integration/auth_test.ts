import * as utils from '../utils'

import { expect, server, chance, request, spy } from '../utils'

import { verifyToken } from '../../lib/jwt'

import * as passwords from '../../lib/password'

describe("Listing Available Webhooks", async () => {

  it("POST /v1/api/account/register should register an account", async () => {

    let email = chance.email()
    let password = chance.word()

    let response = await request
      .post('/v1/api/account/register')
      .send({ email, password })

    expect(response.statusCode).to.be.equal(201)

    expect(response.body.user.id).to.be.greaterThan(0)

    expect(response.body.accessToken).to.be.a("string")

    const decodedToken = await verifyToken(response.body.accessToken);

    expect(decodedToken.account_id).to.be.equal(response.body.user.id)

  })

  it("POST /v1/api/account/login should return an accessToken and user", async () => {

    let email = chance.email()
    let password = chance.word()

    let { body } = await request
      .post('/v1/api/account/register')
      .send({ email, password })

    let response = await request
      .post('/v1/api/account/login')
      .send({ email, password })

    expect(response.statusCode).to.be.equal(200)

    expect(response.body.user.id).to.be.greaterThan(0)

    let { accessToken } = response.body

    expect(accessToken).to.be.a("string")

    const decodedToken = await verifyToken(accessToken);

    expect(decodedToken.account_id).to.be.equal(body.user.id)

  })

  it("GET /v1/api/account/my-account should require an access token", async () => {

    let email = chance.email()
    let password = chance.word()

    var response = await request
      .post('/v1/api/account/register')
      .send({ email, password })

    const { accessToken } = response.body

    response = await request
      .get('/v1/api/account/my-account')

    expect(response.statusCode).to.be.equal(401);

    expect(response.body.error).to.be.equal('invalid access token');

    response = await request
      .get('/v1/api/account/my-account')
      .set('Authorization', `Bearer invalidAccessToken`)

    expect(response.statusCode).to.be.equal(401);

    expect(response.body.error).to.be.equal('invalid access token');

    response = await request
      .get('/v1/api/account/my-account')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ email, password });

    expect(response.statusCode).to.be.equal(200);

    expect(response.body.user.id).to.be.greaterThan(0);

    expect(response.body.user.email).to.be.equal(email);

  })

  it("POST /v1/api/account/password-reset should send an email", async () => {

    let email = chance.email()
    let password = chance.word()

    var response = await request
      .post('/v1/api/account/register')
      .send({ email, password })

    const { accessToken } = response.body.accessToken

    spy.on(passwords, ['sendPasswordResetEmail'])

    response = await request
      .post('/v1/api/account/password-reset')
      .send({ email });

    expect(passwords.sendPasswordResetEmail).to.have.been.called.with(email)

    expect(response.statusCode).to.be.equal(200)


  })

})

