import { log } from "../../../lib"
import { BroadcastTransactionResult } from "../../../lib/plugins"

const Run = require('run-sdk')

const blockchain = new Run.plugins.WhatsOnChain({ network: 'main' })

export const run = new Run({ blockchain })

export async function broadcastTx(txhex: string): Promise<BroadcastTransactionResult> {

    try {

        log.info('bsv.run.broadcastTx', { txhex })

        const txid = await run.blockchain.broadcast(txhex)

        log.info('bsv.run.broadcastTx.result', { txhex, txid })

        return {
            tx_id: txid,
            tx_hex: txhex,
            result: txid,
            success: true,
            currency: 'BSV'
        }

    } catch(error) {

        log.error('bsv.run.broadcastTx.error', error)

        throw error

    }
}
