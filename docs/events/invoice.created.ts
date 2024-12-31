
export default interface InvoiceCreated {
  amount: number;
  memo: string;
  cancelled: boolean;
  is_public_request: boolean;
  currency_specified: boolean;
  replace_by_fee: boolean;
  fee_rate_level: string;
  complete: boolean;
  locked: boolean;
  id: number;
  currency: string;
  account_id: number;
  webhook_url: string;
  external_id: string;
  status: string;
  uid: string;
  uri: string;
}

/* Plus these 
{
      location_id: null,
      register_id: null,
      wordpress_site_url: null,
      status: 'unpaid',
      uid: 'MKEpThgcy',
      uri: 'pay:?r=https://api.anypayx.com/r/MKEpThgcy',
      updatedAt: '2023-02-01T08:02:55.945Z',
      createdAt: '2023-02-01T08:02:55.945Z',
      expiry: '2023-02-01T08:17:55.946Z',
      email: null,
      app_id: null,
      secret: null,
      item_uid: null,
      metadata: null,
      headers: null,
      tags: null,
      completed_at: null,
      redirect_url: null,
      currency: null,
      address: null,
      energycity_account_id: null,
      access_token: null,
      hash: null,
      settledAt: null,
      paidAt: null,
      invoice_uid: 'MKEpThgcy'
    }
    */
