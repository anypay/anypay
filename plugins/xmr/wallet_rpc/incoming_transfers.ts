
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#incoming_transfers'

export const method = 'incoming_transfers'

export const description = 'Return a list of incoming transfers to the wallet.'

export interface Inputs {
    transfer_type: string;
    account_index?: number;
    subaddr_indices?: number[];
    verbose?: boolean;
}

interface Transfer {
    amount: number;
    global_index: number;
    key_image: string;
    spent: boolean;
    subaddr_index: number;
    tx_hash: string;
    tx_size: number;
}

export interface Outputs {
    transfers: Transfer[];
}