
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#get_accounts'

export const method = 'get_accounts'

export const description = 'Get all accounts for a wallet. Optionally filter accounts by tag.'

export interface Inputs {
    tag?: string;
}

interface SubaddressAccount {
    account_index: number;
    balance: number;
    base_address: string;
    label?: string;
    tag?: string;
    unlocked_balance: number;
}

export interface Outputs {
    subaddress_accounts: SubaddressAccount[];
    total_balance: number; // unsigned int
    total_unlocked_balance: number; // unsigned int
}