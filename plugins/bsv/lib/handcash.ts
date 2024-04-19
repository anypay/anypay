
import * as http from 'superagent';

export async function lookupHandle(handle: string): Promise<string> {

  let name = handle.substring(1); // remove $ from beginning

  let url = `https://api.handcash.io/api/receivingAddress/${name}`;

  let resp = await http.get(url);

  return resp.body.receivingAddress;

}
