import {generatePaymentRequest} from '../lib/paymentRequest';

const assert = require('assert')


describe("Generating payment request", ()=>{

  it("should return a request to pay a single bch address", async ()=>{

    const uid = "4290d0ed-28a6-423b-a36d-c4740cbbce50" 

    let request = await generatePaymentRequest(uid)

    assert.equal(request.network, "main")
    assert.equal(request.currency, "BCH")
    assert.equal(request.requiredFeeRate, 1)
    assert.equal(request.outputs[0].address, "bitcoincash:qqq48d73nmvpqt6d5naxpya453pa24xlzuymtjzu76")
    assert.equal(request.outputs[0].amount, 368000)
    

  })


})

