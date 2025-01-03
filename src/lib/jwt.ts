/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================
import { log } from '@/lib/log'
import { sign, verify, Algorithm } from 'jsonwebtoken'
import { config } from '@/lib/config'
import { generateKeyPairSync } from 'crypto'
import { readFileSync } from 'fs';

let privateKey: string;
let publicKey: string;

// Try to get keys from environment variables first
if (config.get('JWT_PRIVATE_KEY') && config.get('JWT_PUBLIC_KEY')) {
  privateKey = config.get('JWT_PRIVATE_KEY');
  publicKey = config.get('JWT_PUBLIC_KEY');
} else if (config.get('JWT_PRIVATE_KEY_PATH') && config.get('JWT_PUBLIC_KEY_PATH')) {
  privateKey = readFileSync(config.get('JWT_PRIVATE_KEY_PATH'), 'utf8');
  publicKey = readFileSync(config.get('JWT_PUBLIC_KEY_PATH'), 'utf8');
} else {
  // Generate random keys if neither env vars nor files are provided
  log.info('JWT keys not found in config. Generating random keys in memory.');
  const keys = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });
  privateKey = keys.privateKey;
  publicKey = keys.publicKey;
}

const issuer = config.get('DOMAIN');
const subject = `auth@${config.get('DOMAIN')}`;
const audience = `https://${config.get('DOMAIN')}`;
const algorithm: Algorithm = 'RS512';

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
