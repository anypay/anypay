
interface Map<T> {
    [key: string]: T;
}

type AccountAddresses = Map<AccountAddress>;

interface AccountAddress {
  account_id: number;
  currency: string;
  address: string;
  xpubkey: boolean;
  nonce: number;
  enabled: boolean;
  name?: string;
  code?: string;
}

export {
  AccountAddress,
  AccountAddresses,
}

