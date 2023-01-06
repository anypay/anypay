

require('dotenv').config()

import { getNewBlockWebhook } from "../../lib/blockcypher"

async function main() {

    const result = await getNewBlockWebhook()

    console.log('result', result)
}

main()
