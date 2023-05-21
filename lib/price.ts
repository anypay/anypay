
export type PriceSource = string;

export type BaseCurrency = string;

export interface Price {

  base: BaseCurrency;

  currency: string;

  chain?: string;

  value: number;

  source: PriceSource;

}
