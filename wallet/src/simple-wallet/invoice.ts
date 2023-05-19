
export class Invoice {
  uri: string;
  uid: string;
  status: string;
  payment?: Payment;
}

export class Payment {
  invoice: Invoice;
  txid: string;
}

