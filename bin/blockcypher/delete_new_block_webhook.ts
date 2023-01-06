
<<<<<<< HEAD

=======
>>>>>>> ec198a78f8b9cedbbc1b358f62f48a181a7c18ae
require('dotenv').config()

import { deleteNewBlockWebhook } from "../../lib/blockcypher"

async function main() {

    const result = await deleteNewBlockWebhook()

    console.log('result', result)
}

main()
<<<<<<< HEAD

=======
>>>>>>> ec198a78f8b9cedbbc1b358f62f48a181a7c18ae
