
export class AddressChangeSet {
  account_id: number;
  currency: string;
  address: string;

  constructor(accountId: number, currency: string, address: string) {
    this.account_id = accountId;
    this.currency = currency;
    this.address = address;
  }
}

