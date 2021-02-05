
import { getBalance } from '../../../lib/anypayx'

export async function show(req, h) {

  let balance = await getBalance(req.account.id)

  return { balance, account_id: req.account.id }

}

