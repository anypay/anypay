
const bcrypt = require('bcryptjs');

export async function hash(password) {

  return new Promise((resolve, reject) => {

    bcrypt.hash(password, 10, (error, hash) => {

      if (error) { return reject(error) }

      resolve(hash);

    })

  });

}


export function toKeyValueString(json: any) {

  let entries = Object.entries(json)

  return entries.reduce((str, entry) => {

    return `${str}${entry[0]}=${entry[1]} `

  }, '')

}


