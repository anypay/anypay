
export const method = '/save_bc'

export const description = 'Save the blockchain. The blockchain does not need saving and is always saved when modified, however it does a sync to flush the filesystem cache onto the disk for safety purposes against Operating System or Hardware crashes.'

export interface Inputs {
    categories?: string;
}

export enum Category {
    default,
    net,
    'net.http',
    'net.p2p',
    logging,
    'net.throttle',
    'blockchain.db',
    'blockchain.db.lmdb',
    'bcutil',
    checkpoints,
    'net.dns',
    'net.dl',
    'i18n',
    perf,
    stacktrace,
    updates,
    account,
    cn,
    difficulty,
    hardfork,
    miner,
    blockchain,
    txpool,
    'cn.block_queue',
    'net.cn',
    'daemon',
    'debugtools.deserialize',
    'debugtools.objectsizes',
    'device.ledger',
    'wallet.gen_multisig',
    multisig,
    bulletproofs,
    ringct,
    'daemon.rpc',
    'wallet.simplewallet',
    'WalletAPI',
    'wallet.ringdb',
    'wallet.wallet2',
    'wallet.rpc',
    'tests.core'
}

export enum Level {
    FATAL,
    ERROR,
    WARNING,
    INFO,
    DEBUG,
    TRACE
}

export interface Outputs {
    categories: string;
    status: string;
    untrusted: boolean;
}
