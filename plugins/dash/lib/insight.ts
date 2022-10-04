
import axios from 'axios'
import { log } from '../../../lib'
import { BroadcastTransactionResult } from '../../../lib/plugins'

export async function broadcastTx(txhex: string): Promise<BroadcastTransactionResult> {

  try {

    log.info('dash.insight.broadcastTx', { txhex })

    const response = await axios.post('https://insight.dash.org/insight-api/tx/send', {
      rawtx: txhex,
      maxfeerate: 0
    })
  
    const { data } = response
  
    console.log('DATA', data)
  
    if (response.status !== 200) {
  
      log.info('dash.insight.broadcastTx.error', { txhex, data: response.data, status: response.status })
  
      throw new Error('DashInsightBroadcastTxError')
    }
  
    log.info('dash.insight.broadcastTx.result', { txhex, data })
  
    return {
      tx_hex: txhex,
      tx_id: data.txid,
      result: data,
      success: true,
      currency: 'DASH'
    }
    
  } catch(error) {

    console.log(error)

    log.error('dash.insight.broadcastTx.error', error)

    throw error
    
  }



}
