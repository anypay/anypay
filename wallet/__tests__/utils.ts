
import * as assert from 'assert'

export { assert }

import * as chai from 'chai'

const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)

const expect = chai.expect

export { expect } 

import { Server } from 'hapi'

export async function authRequest(server: Server, password: string, request) {

    if (!request.headers) { request['headers'] = {} }
  
    let token = new Buffer(`${password}:`).toString('base64');
  
    request.headers['Authorization'] = `Basic ${token}`
  
    return server.inject(request)
  
  }

