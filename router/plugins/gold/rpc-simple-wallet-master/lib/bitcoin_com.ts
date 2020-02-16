
let API = `https://rest.bitcoin.com/v2/address/utxo`;

import * as http from 'superagent';

export async function getUtxos(address: string): Promise<any> {

  let resp = await http.get(`${API}/${address}`);

  return resp.body.utxos;

}

