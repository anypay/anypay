import { IndexAttachment } from "aws-sdk/clients/clouddirectory"

export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#label_address'

export const method = 'label_address'

export const description = 'Label an address.'

export interface Inputs {
    index: IndexAttachment;
    label: string;
}

export interface Outputs {
    // None
}
