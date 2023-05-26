
import PaymentOption from './payment_option'

export default interface PaymentRequest {

  url: string;

  paymentOptions: PaymentOption[];

  createdAt: Date;

  expiresAt: Date;

}
