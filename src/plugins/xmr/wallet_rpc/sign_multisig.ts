
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#sign_multisig'

export const method = 'sign_multisig'

export const description = 'Sign a transaction in multisig.'

export interface Inputs {
    tx_data_hex: string;
}

export interface Outputs {
    tx_data_hex: string;
    tx_hash_list: string[];
}