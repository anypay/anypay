
export const method = 'get_connections'

export const url = `https://www.getmonero.org/resources/developer-guides/daemon-rpc.html#${method}`

export const description = 'Retrieve information about incoming and outgoing connections to your node.'


export interface Inputs {
    // None
}

export interface Connection {
    address: string;
    avg_download: number;
    avg_upload: number;
    connection_id: string;
    current_download: number;
    current_upload: number;
    height: number;
    host: string;
    incoming: boolean;
    ip: string;
    live_time: number;
    local_ip: boolean;
    localhost: boolean;
    peer_id: string;
    port: string;
    recv_count: number;
    recv_idle_time: number;
    send_count: number;
    send_idle_time: number;
    state: string;
    support_flags: number;
}

export interface Outputs {
    connections: Connection[];
    status: string;
    untrusted: boolean;
}