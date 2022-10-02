import { log } from "../../../lib"
import { BroadcastTxResult } from "../../../lib/plugins"

const Run = require('run-sdk')

const blockchain = new Run.plugins.WhatsOnChain({ network: 'main' })

export const run = new Run({ blockchain })

export async function broadcastTx(txhex: string): Promise<BroadcastTxResult> {

    try {

        log.info('bsv.run.broadcastTx', { txhex })

        const txid = await run.blockchain.broadcast(txhex)

        log.info('bsv.run.broadcastTx.result', { txhex, txid })

        return {
            txid,
            txhex,
            result: txid,
            success: true
        }

    } catch(error) {

        log.error('bsv.run.broadcastTx.error', error)

        throw error

    }
}
