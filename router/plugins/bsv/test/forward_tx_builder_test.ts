import * as assert from 'assert';
import * as bsv from 'bsv';
import * as lib from '../lib';

import {createOutputTxFromInputTx} from '../lib/createOutputTxFromInputTx'
describe("TxForwarder", ()=>{
 
  it("should get the address route from  hex of a transaction", async ()=>{

    let inputTx = {
       amount: 0.00062,
       confirmations: 1,
       blockhash: '0000000000000000033755ee15dd8c0c8a0c378b21c2e247a1f110a9aea89092',
       blockindex: 8,
       blocktime: 1570032518,
       txid: 'f0278b370e4a60f8d1679561fb59842f83280f4d62c61f8f9e3637792de198de',
      walletconflicts: [],
      time: 1570032433,
      timereceived: 1570032433,
      details: [
      {
        account: '',
        address: '1CGQqd1b5xR3Wc4qwzNfMgmHScVMcxN7dp',
        category: 'receive',
        amount: 0.00062,
        label: '',
        vout: 0
      }
      ],
      hex: '020000000156af63e837e5a7d6ebdcdc378a2797e334faa5345ca7bb759d4bc19477bde83c010000006a47304402206446e3d59ffbb4b1c929522763ca581a291f7f885f6c456dd620ea9b4027b62b0220542d02ff8c9d5bde7f0a7cfe1b535622c418f119b5665ca56e8ef483be1dd7634121039a6b82d0a63a2964077bd39b674a9044a548c8e924438b18b5caf915012b8c14ffffffff0230f20000000000001976a9147b9385b244a6ad41db69fffd2641b3c1e96ba38588acb5919505000000001976a91489ae211be318921667ed0bf98f0694304d86f52b88ac00000000'
   }  

    let route = await lib.getAddressRouteFromTx(new bsv.Transaction(inputTx.hex))

    console.log(route)

    assert(route.HDKeyAddress)
    assert(route.input)
    assert(route.output)

  })


  it.skip("should derive correct private key from the route", ()=>{

    let masterPrivateKey = 'xprv9s21ZrQH143K3JhNG52R6CJjPZv4ZEAYZiFoA2r5GddzpZHY2k18bghSTNpEdn1unQBVQPNiPbyh1sQUBdhRUcCEV11AzYVEayt8BfM9HiH'

    let pk = new bsv.HDPrivateKey(masterPrivateKey) 

    let masterPublicKey = pk.hdPublicKey.toString()

    let nonce = 1

    let expectedDerivedKey = pk.deriveChild(nonce).privateKey.toString() 

    let publicAddressForDerivedKey =  pk.deriveChild(nonce).publicKey.toAddress().toString()

   let route = {

    input: {

      address: publicAddressForDerivedKey,

      currency: 'BSV' 
    },

    output: {

      address: '1Xy6Gh6zGghVHw3vkPsRb2KMXQbNQiG1b',

      currency: 'BSV' 

    },
    HDKeyAddress: {
      id: 1,
      address: publicAddressForDerivedKey,
      currency:"BSV",
      xpub_key: masterPublicKey

    }

   }

   
    let derivedPrivateKey = lib.derivePrivateKey( pk, route.HDKeyAddress.id)

    assert.equal(derivedPrivateKey, '0e13dd74a6bca3ca53d989df01bbc277d6c50c0727cfc0431622abcdd4099498')

  })

  it.skip("should build an output transaction with an input tx and address route", ()=>{

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

    let pk = new bsv.HDPrivateKey(masterPrivateKey) 

    let masterPublicKey = pk.hdPublicKey.toString()

    let nonce = 1

    let expectedDerivedKey = pk.deriveChild(nonce).privateKey.toString() 

    let publicAddressForDerivedKey =  pk.deriveChild(nonce).publicKey.toAddress().toString()

    let route = {

    input: {

      address: publicAddressForDerivedKey,

      currency: 'BSV' 
    },

    output: {

      address: '1Xy6Gh6zGghVHw3vkPsRb2KMXQbNQiG1b',

      currency: 'BSV' 

    },
    HDKeyAddress: {
      id: 1,
      address: publicAddressForDerivedKey,
      currency:"BSV",
      xpub_key: masterPublicKey

    }

   }

    let tx  =  lib.createOutputTxFromInputTx(new bsv.Transaction(inputTx.hex), route)

    assert.equal(tx.toString(), '010000000129950d8494d2158dcdcd6bb452141fccf814fcd889aa9b887437b8b28e5f06a90100000000ffffffff013c450000000000001976a91405db4d18817f0395172238a306c615bd77a8fdfe88ac00000000')

    let expectedSignedTx = '010000000129950d8494d2158dcdcd6bb452141fccf814fcd889aa9b887437b8b28e5f06a9010000006b4830450221008c540370a26895a4918aff4a6b9e47281ca243cf51a29eddae54181bee3699d0022058ac49fc53d4ebfc8b09e247d9419263c6d3415fa46d010254b47219bcb09ede012102de2405e1c3eea2e213058c22c2b91230465437bf7b1b6838047bcd280d2adb0fffffffff013c450000000000001976a91405db4d18817f0395172238a306c615bd77a8fdfe88ac00000000'
    let signed = lib.signTransaction(tx,expectedDerivedKey)
    assert(signed.toString(), expectedSignedTx)

  })

 })

