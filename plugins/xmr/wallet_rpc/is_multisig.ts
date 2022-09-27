
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#is_multisig'

export const method = 'is_multisig'

export const description = 'Check if a wallet is a multisig one.'

export interface Inputs {
    // None
}

export interface Outputs {
    mutisig: boolean;
    ready: boolean;
    threshold: number;
    total: number;
}