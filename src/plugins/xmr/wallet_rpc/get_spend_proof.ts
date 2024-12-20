
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#'

export const method = 'get_spend_proof'

export const description = 'Generate a signature to prove a spend. Unlike proving a transaction, it does not requires the destination public address.'

export interface Inputs {
    txid: string;
    message?: string;
}

export interface Outputs {
    signature: string;
}