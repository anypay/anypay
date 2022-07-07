
import { Account } from './account'

const fs   = require('fs');
const jwt  = require('jsonwebtoken');
const path = require("path");

import { config } from './config'

const privateKey = fs.readFileSync(
  process.env.JSONWEBTOKEN_PRIVATE_KEY_PATH ||
  path.join(__dirname, '../config/jwt/jwtRS512.key'),
  'utf8'
);

const publicKey = fs.readFileSync(
  process.env.JSONWEBTOKEN_PUBLIC_KEY_PATH ||
  path.join(__dirname, '../config/jwt/jwtRS512.key.pub'),
  'utf8'
);

const issuer  = config.get('DOMAIN');          // Issuer 
const subject  = `auth@${config.get('DOMAIN')}`;        // Subject 
const audience  = `https://${config.get('DOMAIN')}`; // Audience/ PRIVATE and PUBLIC key

export async function generateAdminToken() {

  var payload = {
    admin: true
  };

  var signOptions = {
     issuer,
     subject,
     audience,
     expiresIn: "12h",
     algorithm:  "RS512"
  };

  var token = jwt.sign(payload, privateKey, signOptions);

  return token;

}

export function generateAccountToken(account: Account, uid: string) {

  var payload = {
    account_id: account.id,
    uid
  };

  var signOptions = {
     issuer,
     subject,
     audience,
     expiresIn: "30d",
     algorithm:  "RS512"
  };

  var token = jwt.sign(payload, privateKey, signOptions);

  return token;

}

export async function verifyToken(token: string) {

  var verifyOptions = {
     issuer,
     subject,
     audience,
     expiresIn: "12h",
     algorithm:  ["RS512"]
  };

  var legit = jwt.verify(token, publicKey, verifyOptions);

  return legit;
}

export {

  publicKey,

  privateKey

};

