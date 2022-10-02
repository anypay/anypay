
export const method = '/send_raw_transaction'

export const description = 'Broadcast a raw transaction to the network.'

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