
export type PriceSource = string;

export type BaseCurrency = string;

export interface SetPrice {

  base_currency: BaseCurrency;

  currency: string;

  chain?: string;

  value: number;

  source: PriceSource;

  updatedAt?: Date;

}
