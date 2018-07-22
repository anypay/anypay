
interface AddressChangeSet {
  account_id: number;
  currency: string;
  address: string;
  metadata?: string;
}

interface DenominationChangeset {
  account_id: number;
  currency: string;
}

export {
  AddressChangeSet,
  DenominationChangeset 
}

