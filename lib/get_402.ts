
import * as bsv from 'bsv'

let secret = process.env.GET402_APP_SECRET

//import { App, Client } from 'get402'
import { App, Client } from '/Users/zyler/github/ProofOfWorkCompany/get402-js/src'

const app = App.load(secret)

export { app, Client }

export function createClient(identifier: string, privatekey?: bsv.PrivateKey) {
 
  return app.loadClient(identifier, privatekey)

}

