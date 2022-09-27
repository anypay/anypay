
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#export_outputs'

export const method = 'export_outputs'

export const description = 'Export all outputs in hex format.'

export interface Inputs {
    // None
}

export interface Outputs {
    outputs_data_hex: string;
}
