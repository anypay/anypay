// Move current types.ts content here
// Remove any Anypay-specific types 

export interface SubscribeRequest {
  id: string;
  method: string;
  params: string[];
}

export interface BlockNotification {
  hash: string;
  height: number;
}

export interface BlockbookMessage {
  id?: string;
  data?: BlockbookData;
}

export type BlockbookData = { 
  hash: string; 
  height: number;
}

export interface BlockbookBlockResponse {
  hash: string;
  height: number;
  time: number;
  txs: BlockbookTransaction[];
}

export interface BlockbookTransaction {
  txid: string;
}

export interface BlockbookConfig {
  wsUrl: string;
  apiKey: string;
  httpUrl: string;
} 