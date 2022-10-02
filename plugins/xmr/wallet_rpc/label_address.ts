import { IndexAttachment } from "aws-sdk/clients/clouddirectory"

export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#label_address'

export const method = 'label_address'

export const description = 'Label an address.'

interface Index {
    major: number;
    minjor: number;
}

export interface Inputs {
    index: IndexAttachment;
    label: string;
}

export interface Outputs {
    // None
}