
import { getTransaction } from '@/plugins/xmr';

;(async () => {

    const response = await getTransaction('5305ac8530fcfcb2b0c98979a39db533f68905135436e4d1d4429d503ea1a267')

    console.log(response)

    process.exit(0);

})()
