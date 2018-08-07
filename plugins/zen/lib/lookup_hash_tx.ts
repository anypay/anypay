const JSONRPC = require('./jsonrpc');

var rpc = new JSONRPC();

async function lookupHashTx(hash: string): Promise<any>{

  console.log('hash', hash);

  try {

    let resp = await rpc.call('getrawtransaction', [hash]);

    if (resp.error) {
      throw new Error(resp.error);
    }

    resp = await decoderawtransaction(resp.result);

    return resp;

  } catch(error){ 

    console.error('error', error.message);

  }

}

async function decoderawtransaction(rawtx: string): Promise<any>{

  try {

    let resp = await rpc.call('decoderawtransaction', [rawtx]);

    if (resp.error) {
      throw new Error(resp.error);
    }

    return resp.result;

  } catch(error){ 

    console.error('error', error.message);

  }

}

export { lookupHashTx }
