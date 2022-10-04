import { check_all_confirmations } from "../plugins/xmr/bin/check_all_confirmations";

export default async function() {

    await check_all_confirmations()

}

export const pattern = '*/45 * * * * *'
