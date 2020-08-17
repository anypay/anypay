#!/usr/bin/env ts-node

import * as http from 'superagent';

const API_BASE = 'http://localhost:8000';

(async () => {

  const uid = 'n-dmLs7Kx'

  let payment = {
    merchantData: '{"invoiceUid":"n-dmLs7Kx","merchantName":"Name","avatarUrl":null}',
    transaction:
     '0100000002cb8f818bcdf12ad93b211b03366a4b1dfbfe2edbad2d779bd478f8d0b59eb61f010000006a473044022031a03930e923a59665e68fee3ef8974b23cf079720fa3511844384a7229fb2c60220239b198bd226b8942142267bd1f17b9156fbfabfa6ab088c22e5a0e7ed683989412102306bbb32ed2201ee2a3340690861aae8d8dcd86d67ff16e5fabdebe9d2ed073cffffffffcb8f818bcdf12ad93b211b03366a4b1dfbfe2edbad2d779bd478f8d0b59eb61f000000006a47304402200714e3699a76be3017cad5c6d8f6746e2d1f2cfd9ad10a323d64b0e6e449562f0220192e37f03803712b9a311a268415ef205824003e1113f8f7fa40e8e041de1763412102fab8e7bdd472c034a9a4669e395622aa6d67206dfe121c229ee0722271d4fb9fffffffff0394110000000000001976a9147e322efa568a0834c4968bd4277cc68ab3f4981e88aca00f0000000000001976a914fde8f61612beecbf7532765d17ce9c36c860187888acf022be00000000001976a914734f5997e3cebdecee1131676bdc08cea7d1507c88ac00000000',
    refundTo: 'test1@simply.cash'
  }

  try {

    let response = await http
      .post(`${API_BASE}/invoices/${uid}/pay/bip270/bsv`)
      .set({
        'accept': 'application/bitcoinsv-paymentack, application/json',
        'content-type': 'application/bitcoinsv-payment'
      })
      .send(JSON.stringify(payment))

    console.log(response);
  } catch(error) {
    console.log(error);
  }

})()

