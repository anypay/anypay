
interface AddressChangeSet {
  account_id: number;
  currency: string;
  address: string;
  metadata?: string;
  paymail?: string;
  address_id?: number;
}

interface DenominationChangeset {
  account_id: number;
  currency: string;
}

export {
  AddressChangeSet,
  DenominationChangeset 
}

