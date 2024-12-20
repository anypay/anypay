
export const method = '/stop_daemon'

export const description = 'Send a command to the daemon to safely disconnect and shut down.'

export interface Inputs {
    // None
}

export interface Outputs {
    status: string;
}
