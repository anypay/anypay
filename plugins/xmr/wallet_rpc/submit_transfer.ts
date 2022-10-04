import axios from "axios";
import { config, log } from "../../../lib";

export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#submit_transfer'

export const method = 'submit_transfer'

export const description = 'Submit a previously signed transaction on a read-only wallet (in cold-signing process).'

export interface Inputs {
    tx_data_hex: string;
}

export interface Outputs {
    tx_hash_list: string[];
}

export default async function submit_transfer(params: Inputs) {

    log.info('xmr.wallet_rpc.submit_transfer', params)

    const response = await axios.post(config.get('wallet_rpc_url'), {
        jsonrpc:"2.0",
        id:"0",
        method: 'tx_data_hex',
        params
    }/*, {
        auth: {
        username: process.env.XMR_RPC_USER,
        password: process.env.XMR_RPC_PASSWORD
        }
    }*/)

    if (response.status !== 200) {

        const error = new Error(response.data)

        log.error('xmr.rpc.call.error', error)

        throw error

    }

    const { data } = response

    log.info('xmr.rpc.call.result', data)
    
    if (data.error) {

        log.error('xmr.rpc.call.error', data.error)

        throw new Error(data.error)

    }

    return data

}
