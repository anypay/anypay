
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#make_multisig'

export const method = 'make_multisig'

export const description = 'Make a wallet multisig by importing peers multisig string.'

export interface Inputs {
    multisig_info: string[];
    threshold: number;
    password: string;
}

export interface Outputs {
    address: string;
    multisig_info: string;
}