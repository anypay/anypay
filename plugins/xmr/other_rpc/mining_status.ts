
export const method = '/mining_status'

export const description = 'Get the mining status of the daemon.'

export interface Inputs {
    // None

}

export interface Outputs {
    active: boolean;
    address: string;
    bg_idle_threshold: number;
    bg_ignore_batter: boolean;
    bg_min_idle_seconds: number;
    bg_target: number;
    block_reward: number;
    block_target: number;
    difficulty: number;
    difficulty_top64: number;
    is_background_mining_enabled: boolean;
    pow_algorithm: string;
    speed: number;
    status: string;
    threads_count: number;
    untrusted: boolean;
    wide_difficulty; string;
}
