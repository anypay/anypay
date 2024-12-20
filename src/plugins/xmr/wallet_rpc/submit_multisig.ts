
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#submit_multisig'

export const method = 'submit_multisig'

export const description = 'Submit a signed multisig transaction.'

export interface Inputs {
    tx_data_hex: string;
}

export interface Outputs {
    tx_hash_list: string[];
}