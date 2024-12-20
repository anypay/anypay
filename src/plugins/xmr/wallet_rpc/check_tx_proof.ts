
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#check_tx_proof'

export const method = 'check_tx_proof'

export const description = 'Prove a transaction by checking its signature.'

export interface Inputs {
    txid: string;
    address: string;
    message?: string;
    signature: string;
}

export interface Outputs {
    confirmations: number;
    good: boolean;
    in_pool: boolean;
    received: number;
}
