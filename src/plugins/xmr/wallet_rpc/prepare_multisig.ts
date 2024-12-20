
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#prepare_multisig'

export const method = 'prepare_multisig'

export const description = 'Prepare a wallet for multisig by generating a multisig string to share with peers.'

export interface Inputs {
    // None
}

export interface Outputs {
    multisig_info: string;
}