
import { models } from './models';
import { log } from './logger';

interface PaymentOption {
  invoice_uid: string;
  currency: string;
  address: string;
  amount: number;
}

export function writePaymentOptions(options: PaymentOption[]) {

  log.info('writepaymentoptions', {options});

  return Promise.all(options.map(option => {

    return models.PaymentOption.create(option);

  }))

}

