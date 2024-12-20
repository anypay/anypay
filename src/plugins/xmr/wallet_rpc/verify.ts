
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#verify'

export const method = 'verify'

export const description = 'Verify a signature on a string.'

export interface Inputs {
    data: string;
    address: string;
    signature: string;
}

export interface Outputs {
    good: boolean;
}