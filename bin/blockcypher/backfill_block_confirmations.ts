require('dotenv').config() 

import { models } from '../../lib/models'

import { confirmTransaction, getTransaction } from '../../lib/blockcypher'

import delay from 'delay'

export async function main() {

    const payments = await models.Payment.findAll({
        where: {
            currency: 'BTC',
            //confirmation_hash: null,
            //confirmation_height: null,
            status: 'confirming'
        }
    })

    for (let payment of payments) {

        try {

            console.log(payment.toJSON())

            const result = await getTransaction(payment.txid)
    
            console.log(result)
    
            let confirmationResult = await confirmTransaction(payment)
    
            console.log(confirmationResult.toJSON())
    
            await delay(100)

        } catch(error) {

            if (error.response.status === 404)

            payment.status = 'expired'

            await payment.save()

            console.error(error)
        }

    }

}

main()
