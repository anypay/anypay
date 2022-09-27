
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#check_spend_proof'

export const description = 'Prove a spend using a signature. Unlike proving a transaction, it does not requires the destination public address.'

export interface Inputs {
    txid: string;
    message?: string;
    signature: string;
}

export interface Outputs {
    good: boolean;
}