
const fs   = require('fs');
const jwt  = require('jsonwebtoken');
const path = require("path");

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

const issuer  = 'anypay.global';          // Issuer 
const subject  = 'admin@anypay.global';        // Subject 
const audience  = 'https://anypay.global'; // Audience/ PRIVATE and PUBLIC key

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

export async function verifyToken(token: string) {

  var payload = {
    admin: true
  };

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

