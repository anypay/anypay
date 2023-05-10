

describe('Payments with Ethereum', () => {

  /*
     To test payments of ETH we shall need several test vectors to run through various scenarios 
  */

  it('should reject payments that were broadcast before the invoice was created')
  it('should reject payments with the incorrect address')
  it('should reject payments with the incorrect amount')
  it('should accept a valid payment and mark the invoice as paid')

  /*
    We also must test confirmations of blocks and webhooks for when ETH payments confirm
  */

  it('should detect confirmations of completed ETH payments')
  it('should update the invoice status to "paid" upon confirmation')
  it('newly paid invoices should be in the "confirming" state')
  it('should send a webhook when the invoice enters confirming state')
  it('should send a webhook when the invoice enters paid state')

  /*
    We may also receive transactions that never confirm and eventually expire
  */

  it('should detect when a transaction has expired and mark the invoice as "unpaid"')

})
