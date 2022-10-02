
import * as zmq from 'zeromq'

import * as core from '../../../lib'

export default async function start({ config, log }) {

  const sock = new zmq.Subscriber

  const url = config.get('xmr_zmq_url')

  if (url) {

    sock.connect(url)
  
    log.info('xmr.zmq.connect', { url })

    sock.subscribe("json-full-txpool_add")
  
    log.info('xmr.zmq.subscribe', { topic: "json-full-txpool_add" })

    sock.subscribe("json-full-chain_main")

    log.info('xmr.zmq.subscribe', { topic: "json-full-chain_main" })

    sock.subscribe("json-full-miner_tx")

    log.info('xmr.zmq.subscribe', { topic: "json-full-miner_tx" })

    sock.subscribe("json-full-miner_data")

    log.info('xmr.zmq.subscribe', { topic: "json-full-miner_data" })
  
    for await (const [topic] of sock) {
  
      try {
  
          const { event, data } = parseMessage(topic)
  
          log.info(`xmr.zmq.message`, { event, data })
          
          log.info(`xmr.zmq.${event}`, { data })
  
      } catch(error) {
  
          log.error('xmr.zmq.error', error)
  
      }
  
    }

  }

}

function parseMessage(topic: Buffer): Message {

    const parts = topic.toString().split(':')

    const [event, ...rest] = parts

    const data = JSON.parse(rest.join(':'))

    return { event, data }

}

interface Message {
    event: string;
    data: any;
}


if (require.main === module) {

    start(core)
    
}



