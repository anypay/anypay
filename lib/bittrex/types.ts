

export interface Order {
  id: string;
  marketSymbol: string;
  direction: string;
  type: string;
  quantity: number;
  limit: number;
  ceiling: number;
  timeInForce: string;
  clientOrderId; string;
  fillQuantity: number;
  commission: number;
  proceeds: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  closedAt: Date;
  orderToCancel: any;
}

export interface Balance {
  currencySymbol: string;
  total: number;
  available: number;
  updatedAt: Date;
}

export interface Address {
  status: string;
  currencySymbol: string;
  cryptoAddress: string;
  cryptoAddressTag: string;
}

export interface Deposit {
  id: string;
  currencySymbol: string;
  quantity: number;
  cryptoAddress: string;
  fundsTransferMethodId: string;
  cryptoAddressTag: string;
  txId: string;
  confirmations: number;
  updatedAt: Date;
  completedAt: Date;
  status: string;
  source: string;
  accountId: string;
  error: any;
}

