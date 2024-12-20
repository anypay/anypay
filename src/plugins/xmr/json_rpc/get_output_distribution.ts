
export const method = 'get_output_distribution'

export const url = `https://www.getmonero.org/resources/developer-guides/daemon-rpc.html#${method}`

export const description = ''


export interface Inputs {
    amounts: number[];
    cumulative: boolean;
    from_height: number;
    to_height: number;
}

interface Distribution {
    amount: number;
    base: number;
    distribution: number[];
    start_height: number;
}

export interface Outputs {
    distributions: Distribution[];
    status: string;
}