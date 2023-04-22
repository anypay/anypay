
import * as bcrypt from 'bcryptjs'

import { log } from './log'

export async function compare(password: string, hash: string): Promise<any> {

    return new Promise((resolve, reject) => {

        try {

            bcrypt.compare(password, hash, (err, isMatch) => {

                if (err) { reject(err); return }

                if (!isMatch) { reject(false) }

                resolve(true)

            })
        
        } catch(error) {
    
            log.debug('account.password.invalid', error)
    
            resolve(true)
    
        }

    })


}
