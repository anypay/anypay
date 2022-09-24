
import * as bcrypt from 'bcryptjs'

export async function compare(password: string, hash: string): Promise<any> {

    return new Promise((resolve) => {

        bcrypt.compare(password, hash, (_, result) => {

            if (result) {

                resolve(true)

            } else {

                resolve(false)

            }


        })

    })

}

export function hash(password): Promise<string> {

    return new Promise((resolve, reject) => {
  
      bcrypt.hash(password, 10, (error, hash) => {

        if (error) { return reject(error) }

        resolve(hash);

      })

    });

}
  