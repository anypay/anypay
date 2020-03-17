import * as assert from 'assert';
import * as btc from 'bitcore-lib';
import * as lib from '../lib';

import {createOutputTxFromInputTx} from '../lib/createOutputTxFromInputTx'
describe("TxForwarder", ()=>{
 
  it("should get the address route from the hex of its transaction", async ()=>{

    let inputTx = {
      amount: 0,
      confirmations: 1572,
      blockhash: '0000000000000000000307d2090d024cae160a5c3f32ee66c83dc8a1788975d8',
      blockindex: 674,
      blocktime: 1565900821,
      txid: '23ccfdda936e7a48eda44ed403165a7863e368b1414bf6eb7cfc07e4847d9c01',
      walletconflicts: [],
      time: 1565899996,
      timereceived: 1565899996,
      'bip125-replaceable': 'no',
      details: [],
      hex: '01000000011286a08ad28e067e6d7e0ba76ca0827f5a41847e243a166ce615475b98a38e93000000006b483045022100e7ea4e4c3d584651a0423f400f6c7f095a0faac7a1f72e4d3cc373f937cc5030022078db1ea8629371bc3a85aee66f9be845d1c35df288ee9ba38e0c978b7ac7f73201210390b2916fe15c5403bbb0d337559f6ccba5f9fc60de2cafdeb58b7e678e9b7380ffffffff02606d0000000000001976a91456f102655b032a5cd93e47bf01934a61923c1b9988ac584f0000000000001976a9149c72a5f0c62514b5b02d11ea6fedd7651028725788ac00000000'
    }


    let route = await lib.getAddressRouteFromTx(new btc.Transaction(inputTx.hex))

    assert(route.HDKeyAddress)
    assert(route.input)
    assert(route.output)

  })


  it("should derive correct private key from the route", ()=>{

    let masterPrivateKey = 'xprv9s21ZrQH143K3JhNG52R6CJjPZv4ZEAYZiFoA2r5GddzpZHY2k18bghSTNpEdn1unQBVQPNiPbyh1sQUBdhRUcCEV11AzYVEayt8BfM9HiH'

    let pk = new btc.HDPrivateKey(masterPrivateKey) 

    let masterPublicKey = pk.hdPublicKey.toString()

    let nonce = 1

    let expectedDerivedKey = pk.deriveChild(nonce).privateKey.toString() 

    let publicAddressForDerivedKey =  pk.deriveChild(nonce).publicKey.toAddress().toString()

   let route = {

    input: {

      address: publicAddressForDerivedKey,

      currency: 'BTC' 
    },

    output: {

      address: '1Xy6Gh6zGghVHw3vkPsRb2KMXQbNQiG1b',

      currency: 'BTC' 

    },
    HDKeyAddress: {
      id: 1,
      address: publicAddressForDerivedKey,
      currency:"BTC",
      xpub_key: masterPublicKey

    }

   }

   
    let derivedPrivateKey = lib.derivePrivateKey( pk, route.HDKeyAddress.id)

    assert.equal(derivedPrivateKey, '0e13dd74a6bca3ca53d989df01bbc277d6c50c0727cfc0431622abcdd4099498')

  })

  it("should build an output transaction with an input tx and address route", ()=>{

    let inputTx = {
      amount: 0,
      confirmations: 0,
      trusted: false,
      txid: 'a9065f8eb2b83774889baa89d8fc14f8cc1f1452b46bcdcd8d15d294840d9529',
      walletconflicts: [],
      time: 1566921459,
      timereceived: 1566921459,
      'bip125-replaceable': 'no',
      details: [],
      hex: '010000000191544db065f78a44d50a0d3fe7bde93b4d4ae426ff744c55f847da49f57b6b18010000006b483045022100fc9c56479f7c34d142a5fe53dbf445b6cd1834444720d5d48617698764961b1102200efb77b565142bd68ac1cc2a71ac9e0ed3cc8486ea23c4feda0ae059d7c83336012103924f3dffd0119b855f6cbaed0fd45c40c3d388f1294fa74a45f7896bd263940dffffffff0221700200000000001976a914fd9dc655c5a57049d6547e0f903748b79eaf0ae088ac0c4d0000000000001976a91471ce1c5448ec1112df2ea9d591246e1cd2b170d888ac00000000'
    }

    let masterPrivateKey = 'xprv9s21ZrQH143K3JhNG52R6CJjPZv4ZEAYZiFoA2r5GddzpZHY2k18bghSTNpEdn1unQBVQPNiPbyh1sQUBdhRUcCEV11AzYVEayt8BfM9HiH'

    let pk = new btc.HDPrivateKey(masterPrivateKey) 

    let masterPublicKey = pk.hdPublicKey.toString()

    let nonce = 1

    let expectedDerivedKey = pk.deriveChild(nonce).privateKey.toString() 

    let publicAddressForDerivedKey =  pk.deriveChild(nonce).publicKey.toAddress().toString()

    let route = {

    input: {

      address: publicAddressForDerivedKey,

      currency: 'BTC' 
    },

    output: {

      address: '1Xy6Gh6zGghVHw3vkPsRb2KMXQbNQiG1b',

      currency: 'BTC' 

    },
    HDKeyAddress: {
      id: 1,
      address: publicAddressForDerivedKey,
      currency:"BTC",
      xpub_key: masterPublicKey

    }

   }

    let tx  =  lib.createOutputTxFromInputTx(new btc.Transaction(inputTx.hex), route)

    assert.equal(tx.toString(), '010000000129950d8494d2158dcdcd6bb452141fccf814fcd889aa9b887437b8b28e5f06a90100000000ffffffff013c450000000000001976a91405db4d18817f0395172238a306c615bd77a8fdfe88ac00000000')

    let expectedSignedTx = '010000000129950d8494d2158dcdcd6bb452141fccf814fcd889aa9b887437b8b28e5f06a9010000006b4830450221008c540370a26895a4918aff4a6b9e47281ca243cf51a29eddae54181bee3699d0022058ac49fc53d4ebfc8b09e247d9419263c6d3415fa46d010254b47219bcb09ede012102de2405e1c3eea2e213058c22c2b91230465437bf7b1b6838047bcd280d2adb0fffffffff013c450000000000001976a91405db4d18817f0395172238a306c615bd77a8fdfe88ac00000000'
    let signed = lib.signTransaction(tx,expectedDerivedKey)
    assert(signed.toString(), expectedSignedTx)

  })

 })

