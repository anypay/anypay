
export const method = '/get_transaction_pool_stats'

export const description = 'Get the transaction pool statistics.'

export interface Inputs {
    // None

}

interface TxpoolHisto {
    txs: number;
    bytes: number;
}

interface PoolStats {
    bytes_max: number;
    bytes_med: number;
    bytes_min: number;
    bytes_total: number;
    fee_total: number;
    histo: TxpoolHisto;
    histo_98pc: number;
    num_10m: number;
    num_double_spends: number;
    num_failing: number;
    num_not_relayed: number;
    oldest: number;
    txs_total: number;
}

export interface Outputs {
    credits: number;
    pool_stats: PoolStats;
}
