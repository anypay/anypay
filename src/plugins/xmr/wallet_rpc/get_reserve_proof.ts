
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#get_reserve_proof'

export const method = 'get_reserve_proof'

export const description = 'Generate a signature to prove of an available amount in a wallet.'

export interface Inputs {
    all: boolean;
    account_inex: number;
    amount: Number;
    message?: string;
}

export interface Outputs {
    signature: string;
}