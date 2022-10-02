
import axios from 'axios'

interface Vin {
    key: {
        amount: number;
        key_offsets: number[],
        k_image: string;
    }
}

interface Vout {
    amount: number;
    target: {
        key: string;
    }
}

interface TransactionData {
    version: number;
    unlock_time: number;
    vin: Vin[];
    vout: Vout[];
    extra: number[];
    signatures: string[];
}

interface GetTransactionDataResponse {
    status: string;
    transaction_data: TransactionData;
}

export async function get_transaction_data(hash: string): Promise<GetTransactionDataResponse> {

    const { data } = await axios.get(`https://localmonero.co/blocks/api/get_transaction_data/${hash}`)

    return data
}

export async function get_stats() {
    
}

export async function get_block_header() {

}

export async function get_block_data() {

}

export async function is_key_image_spent() {

}