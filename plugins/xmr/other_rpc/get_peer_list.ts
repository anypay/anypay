import { NumberOfMemberAccountsOptedIn } from "aws-sdk/clients/computeoptimizer";

export const method = '/get_peer_list'

export const description = 'Get the known peers list.'

export interface Inputs {
    // None

}

interface Peer {
    host: number;
    id: string;
    ip: number;
    last_seen: number;
    port: number;
}

export interface Outputs {
    gray_list: Peer[];
    status: string;
    white_list: Peer[];
}
