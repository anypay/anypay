
export const method = 'on_get_block_hash'

export const url = `https://www.getmonero.org/resources/developer-guides/daemon-rpc.html#${method}`

export const description = "Look up a block's hash by its height."


export type Inputs = number;

export type Outputs = string;
