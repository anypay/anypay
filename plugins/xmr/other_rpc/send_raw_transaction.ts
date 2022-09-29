
export const method = '/send_raw_transaction'

export const description = 'Broadcast a raw transaction to the network.'

import { other_rpc } from '../json_rpc'

export interface Inputs {
    tx_as_hex: string;
    do_not_relay: boolean;
}

export interface Outputs {
    double_spend: boolean;
    fee_too_low:boolean;
    invalid_input: boolean;
    invalid_output: boolean;
    low_mixing: boolean;
    not_rct: boolean;
    not_relayed: boolean;
    overspend: boolean;
    reason: string;
    status: string;
    too_big: boolean;
    untrusted: boolean;
}

export default async function send_raw_transaction(inputs: Inputs): Promise<Outputs> {

    const result: Outputs = await other_rpc.call<Outputs>('/send_raw_transaction', inputs)

    return result

}