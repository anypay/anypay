
describe("Getting Quote From Denomination Currency", () => {

  it("getQuote should convert the denomination amount to payment amount", async () => {

    let account = await anypay.registerAccount("steven@anypay.global", "password");

    const currency = 'DASH';
    const denomination = "VEF";
    const denominationAmount = 1500000;

    const denominationCurrency = await anypay.settings.setDenomination(account.id, "VEF");

    let quote = await anypay.createQuote(account.id, denominationAmount, currency);

    assert(quote.amount > 0);
    assert.strictEqual(quote.currency, currency);

    assert(quote.denomination_amount, denominationAmount);
    assert(quote.denomination_currency, denominationCurrency);

  });

});

