
import * as database from '../../../lib/database'

export async function dailyPaidInvoices() {
  let result = await database.query(`SELECT date_trunc('day', invoices."createdAt") "day", count(*) FROM invoices WHERE status = 'paid' group by 1 ORDER BY 1`)

  return { result }
}
