require('dotenv').config();

import * as jwt from 'jsonwebtoken';

export function decodeWebtoken(token: string) {

  return new Promise((resolve, reject) => {

    jwt.verify(token, process.env.WEBTOKEN_SIGNING_SECRET, function(err, decoded) {
      if (err) { return reject(err) }
      resolve(decoded);
    });

  });

}

