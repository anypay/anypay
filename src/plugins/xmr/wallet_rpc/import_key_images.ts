
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#image_key_images'

export const method = 'image_key_images'

export const description = 'Import signed key images list and verify their spent status.'

interface SignedKeyImage {
    key_image: string;
    signature: string;
}

export interface Inputs {
    signed_key_images: SignedKeyImage[];
}

export interface Outputs {
    height: number;
    spent: number;
    unspent: number;
}