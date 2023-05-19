
export interface Payment {
  uid: string;
  tx_id: string;
  currency_paid: string;
  amount: number;
  currency: string;
}

export async function listPayments(): Promise<Payment[]> {

  return []

}

