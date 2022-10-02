
export const method = 'submit_block'

export const url = `https://www.getmonero.org/resources/developer-guides/daemon-rpc.html#${method}`

export const description = 'Submit a mined block to the network.'


export type Inputs = string[];

export interface Outputs {
    status: string;
}