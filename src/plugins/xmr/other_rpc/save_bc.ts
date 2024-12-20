
export const method = '/save_bc'

export const description = 'Save the blockchain. The blockchain does not need saving and is always saved when modified, however it does a sync to flush the filesystem cache onto the disk for safety purposes against Operating System or Hardware crashes.'

export interface Inputs {
    // None

}

export interface Outputs {
    status: string;
    untrusted: boolean;
}
