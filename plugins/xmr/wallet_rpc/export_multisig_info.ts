
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#export_multisig_info'

export const method = 'export_multisig_info'

export const description = 'Export multisig info for other participants.'

export interface Inputs {
    // None
}

export interface Outputs {
    info: string;
}