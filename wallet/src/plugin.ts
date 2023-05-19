
abstract class PluginBase {

  chain: string;

  currency: string;
  
  decmials: number;

  getBalance(): Promise<number>;

  getAddress(): Promise<string>;

  getPrivateKey(): Promise<any>;

  buildPayment(paymentRequest: PaymentRequest): Promise<Payment>;

  transmitPayment(payment: Payment): Promise<Payment>;

}

interface PaymentRequest {

}

