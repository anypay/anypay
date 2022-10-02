
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#import_outputs'

export const method = 'import_outputs'

export const description = 'Import outputs in hex format.'

export interface Inputs {
    outputs_data_hex: string;
}

export interface Outputs {
    num_imported: number;
}