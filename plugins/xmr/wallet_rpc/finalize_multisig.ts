
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#finalize_multisig'

export const method = 'finalize_multisig'

export const description = 'Turn this wallet into a multisig wallet, extra step for N-1/N wallets.'

export interface Inputs {
    multisig_into: string[];
    password: string;
}

export interface Outputs {
    address: string;
}