
import { models } from './models';

interface PaymentOption {
  invoice_uid: string;
  currency: string;
  address: string;
  amount: number;
}

export function writePaymentOptions(options: PaymentOption[]) {

  console.log('write options', options);

  return Promise.all(options.map(option => {

    return models.PaymentOption.create(option);

  }))

}

