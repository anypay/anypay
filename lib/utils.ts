
const bcrypt = require('bcryptjs');

export async function bcryptCompare(password, hash) {

  return new Promise((resolve, reject) => {

    bcrypt.compare(password, hash, (error, res) => {

      if (res) {

        resolve();

      } else {

        reject(new Error("invalid email or password"));

      }
    })
  })
}



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

export function cleanObjectKeys(json: any): any {

  Object.entries(json).map(([key, value]) => {

    if (value === "" || value === null){
        delete json[key];
    }
  });

  return json
}


