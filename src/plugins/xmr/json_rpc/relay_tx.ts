
export const method = 'relay_tx'

export const url = `https://www.getmonero.org/resources/developer-guides/daemon-rpc.html#${method}`

export const description = 'Relay a list of transaction IDs.'

export interface Inputs {
    txids: string[]
}

export interface Outputs {
    status: string;
}
