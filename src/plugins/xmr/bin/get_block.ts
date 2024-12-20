
import get_block from '@/plugins/xmr/json_rpc/get_block';

;(async () => {

    const response = await get_block({ height: 2717241 })

    console.log(response)

    process.exit(0);

})()
