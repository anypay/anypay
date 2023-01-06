

require('dotenv').config()

import { createNewBlockWebhook } from "../../lib/blockcypher"

async function main() {

    const result = await createNewBlockWebhook()

    console.log('result', result)
}

main()

