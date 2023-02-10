
//import { models } from '../models'

/*interface AccountWebsocket {
  socket: any;
  account_id: number;
}
*/

const sockets = {}

export async function connectWebsocket(account_id) {

  //let { api_key, api_secret } = await models.BittrexAccount.findOne({ where: { account_id }}) 

  /* 
   * 1) First connect a websocket
   * 2) Authenticate Websocket
   * 3) Listen for de-authentication warnings (one minute before de-authentication)
   * 4) Handle disconnection by automatically reconnecting and performing authentication
   * 5) Subscribe to account order events 
   */

  sockets[account_id] = {} // save socket in memory here

}



