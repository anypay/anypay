
import PaymentOption from './payment_option'

interface PaymentRequest {

  url: string;

  paymentOptions: PaymentOption[];

  createdAt: Date;

  expiresAt: Date;

}

class PaymentRequest {

}

export default PaymentRequest
