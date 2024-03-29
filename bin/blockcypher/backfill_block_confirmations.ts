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

require('dotenv').config() 

import { confirmTransaction, getTransaction } from '../../lib/blockcypher'

import delay from 'delay'
import prisma from '../../lib/prisma'

export async function main() {

    const payments = await prisma.payments.findMany({
        where: {
            currency: 'BTC',
            //confirmation_hash: null,
            //confirmation_height: null,
            status: 'confirming'
        }
    })

    for (let payment of payments) {

        try {

            const result = await getTransaction(String(payment.chain), payment.txid)
    
            console.log(result)
    
            let confirmationResult = await confirmTransaction(payment)
    
            console.log(confirmationResult)
    
            await delay(100)

        } catch(error: any) {

            if (error.response.status === 404)

            await prisma.payments.update({
                where: {
                    id: payment.id,                    
                },
                data: {
                    status: 'expired',
                    updatedAt: new Date()
                }
            })

            console.error(error)
        }

    }

}

main()
