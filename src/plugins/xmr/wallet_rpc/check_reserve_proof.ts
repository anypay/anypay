
// https://monerodocs.org/interacting/monero-wallet-rpc-reference/#check_reserve_proof


export const method = 'check_reserve_proof'

export const description = 'Proves a wallet has a disposable reserve using a signature.'

export interface Inputs {

    address: string;
    message?: string;
    signature: string;
}

export interface Outputs {
    good: boolean;
}
