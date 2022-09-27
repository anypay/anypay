
export const method = '/is_key_image_spent'

export const description = 'Check if outputs have been spent using the key image associated with the output.'

export interface Inputs {
    key_images: string[]
}

export interface Outputs {
    credits: number;
    spent_status: number;
    status: string;
    top_hash: string;
    untrusted: boolean;
}