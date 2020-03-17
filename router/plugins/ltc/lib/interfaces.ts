
interface AddressForward extends AddressForwardOptions {
  input_address: string;
  uid: string;
}

interface AddressForwardOptions {
  destination: string;
  uid?: string;
  process_fees_satoshis?: number;
  process_fees_address?: string;
  process_fees_percent?: number;
  callback_url?: string;
  enable_confirmations?: boolean;
  mining_fee_satoshis?: number;
  txns?: string[];
}

interface AddressForwardCallback {
  value: number;
  input_address: string;
  destination_address: string;
  input_transaction_hash: string;
  destination_transaction_hash: string;
}

export {

  AddressForward,

  AddressForwardOptions,

  AddressForwardCallback

}
