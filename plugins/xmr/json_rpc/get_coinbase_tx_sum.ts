
export const method = 'get_coinbase_tx_sum'

export const url = `https://www.getmonero.org/resources/developer-guides/daemon-rpc.html#${method}`

export const description = 'Get the coinbase amount and the fees amount for n last blocks starting at particular height'


export interface Inputs {
    height: number;
    count: number;
}

export interface Outputs {
    credits: number;
    emission_amount: number;
    emission_amount_top64: number;
    fee_amount: number;
    fee_amount_top64: number;
    status: string;
    top_hash: string;
    untrusted: boolean;
    wide_emission_amount: string;
    wide_fee_amount: string;
}