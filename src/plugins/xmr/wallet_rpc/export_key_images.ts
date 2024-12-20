
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#export_key_images'

export const method = 'export_key_images'

export const description = 'Export a signed set of key images.'

interface SignedKeyImage {
    key_image: string;
    signature: string;
}

export interface Inputs {
    // None
}

export interface Outputs {
    signed_key_images: SignedKeyImage[];
}