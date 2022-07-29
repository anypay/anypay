
import axios from 'axios';

(async () => {

  let { data } = await axios.post('https://xmr.nodes.anypayx.com/json_rpc', {
    jsonrpc:"2.0",
    id:"0",
    method: 'transfer',
    params: {
      get_tx_hex: true,
      get_tx_key: true,
      get_tx_metadata: true,
      do_not_relay: true,
      destinations: [{
        address: "463jsVqBMm36nf4EM8QEZnPBSFVAoNP1ydfJGbkePR5q53CU3UDjGBGfHDDT2dNowZh1PeqYZbFvjMr1hac2kpaoKGcF2fk",
        amount: 10000
      }]
    }
  }, {
    auth: {
      username: 'monero-rpc',
      password: '55b808ae3a0ce09d93621f87f0215087'
    }
  })

  console.log(data)

  /*let response = await axios.post('https://xmr.nodes.anypayx.com/json_rpc', {
    jsonrpc:"2.0",
    id:"0",
    method: 'submit_transfer',
    params: {
      "tx_data_hex": tx_blob
    }
  }, {
    auth: {
      username: 'monero-rpc',
      password: '55b808ae3a0ce09d93621f87f0215087'
    }
  })

  console.log(response)*/

})();
