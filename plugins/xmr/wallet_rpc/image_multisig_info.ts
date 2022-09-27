
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#import_multisig_info'

export const method = 'import_multisig_info'

export const description = 'Import multisig info from other participants.'

export interface Inputs {
    info: string[];
}

export interface Outputs {
    n_outputs: number;
}
