
import { log } from './log'

import { readFileSync } from 'fs'

import { sign, verify, Algorithm } from 'jsonwebtoken'

import { config } from './config'

const privateKey = readFileSync(config.get('JSONWEBTOKEN_PRIVATE_KEY_PATH'), 'utf8')

const publicKey = readFileSync(config.get('JSONWEBTOKEN_PUBLIC_KEY_PATH'), 'utf8')

const issuer  = config.get('DOMAIN');          // Issuer 
const subject  = `auth@${config.get('DOMAIN')}`;        // Subject 
const audience  = `https://${config.get('DOMAIN')}`; // Audience/ PRIVATE and PUBLIC key

const algorithm: Algorithm = 'RS512'

export async function generateAdminToken() {

  var payload = {
    admin: true
  };


  var signOptions = {
     issuer,
     subject,
     audience,
     expiresIn: "12h",
     algorithm
  };

  log.info('jwt.generateAdminToken', { payload, signOptions })

  var token = sign(payload, privateKey, signOptions);

  return token;

}

interface GenerateAccountToken {
  account_id: number;
  uid: string;
}

export function generateAccountToken({account_id, uid}: GenerateAccountToken): string {

  var payload = {
    account_id,
    uid
  };

  var signOptions = {
     issuer,
     subject,
     audience,
     expiresIn: "30d",
     algorithm
  };

  log.info('jwt.generateAccountToken', { payload, signOptions })

  var token = sign(payload, privateKey, signOptions);

  return token;

}

export async function verifyToken(token: string): Promise<any> {

  var verifyOptions = {
     issuer,
     subject,
     audience,
     expiresIn: "12h",
     algorithm:  ["RS512"]
  };

  log.info('jwt.verifyToken', {verifyOptions})

  var decoded = verify(token, publicKey, verifyOptions);

  log.info('jwt.verifyToken.result', {verifyOptions, decoded})

  return decoded;
}

export {

  publicKey,

  privateKey

};
