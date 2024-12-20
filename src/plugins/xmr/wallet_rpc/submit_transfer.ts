import { log } from "../../../lib";
import { monero_wallet_rpc } from "../wallet_rpc";

export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#submit_transfer'

export const method = 'submit_transfer'

export const description = 'Submit a previously signed transaction on a read-only wallet (in cold-signing process).'

export interface Inputs {
    tx_data_hex: string;
}

export interface Outputs {
    tx_hash_list: string[];
}

export default async function submit_transfer(inputs: Inputs): Promise<Outputs> {

    log.info('xmr.wallet_rpc.submit_transfer', inputs)

    return monero_wallet_rpc.call<Outputs>('submit_transfer', inputs)
}