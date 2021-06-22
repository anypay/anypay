
import { database } from '../lib/paypow/database'

export async function index(req, h) {

  let orders = await database.select().table('orders').orderBy('createdAt', 'desc')

  return { orders }

}
