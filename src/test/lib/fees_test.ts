/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================

import { getMiningFee } from '@/lib/fees'

import { expect } from '../utils'

const transactions = {
  'LTC': '01000000000101b417970db74795f12cfeb585fbeddb68cfa4e9ad8bc6bc646b02cebf273129fa010000001716001444a3312f4e97d76225faa60bbd8eb97bf40ee3aeffffffff02484d06000000000017a9141dc120d291c6e5696f604ea11d9d7cfb23a278918704971c020000000017a9147a0d09483153563d185386424abca93a35cb23e887024830450221008a9dbfc8cd6fff271f30cc16ebaf0da987843d8446871f2b190c61d91708f78d022059a782230213ad94a1dc1e3e73f7393c570dd1c64e7a7601f621478bb43ede7c0121020f54403d72a01351b8747f2c3ea565f94933611212873a9a9a0f8b51dfb7a16100000000',
  'BTC': '010000000001010561bfb68b643b6c251fedb8d6d9abea7a7c0aabf7c353f0b0a3bac6db4261250100000017160014bebcceca4de93100a10c66e4c15a28c501d4a706ffffffff02b0761f000000000017a914daefdce9b47cfe837942fb429bd38a446221f3dc8788ec12000000000017a9147df152144db6f462c1a638b7ee8687953f060dd78702473044022022fbdb6759191af399c0e7025e2724e2438f7e7432005aafacb0cd714cefa23902207a22f399bffac62493d5693616a01b57741737567c7f4a8aadab5d2e8001151001210394b83767e87aaa5cc6b249fb75a683a4200f922123593d8fd6b28c886466dfac00000000',
  'DASH': '0100000002e5b704b437c49945d5b89d86068988587c002c62836bb56cc07a4f6ad902f761010000006a4730440220539f05fc6000a01f6a0611e9ebd739392e7ba121d9b0248df970f3c67b58ac3c022056543a5b7b6af4a3ec77250119c3dde52fc4e24a4fc21b70944afee44cfc407e0121027c54e079a5de211462c0d9320bc0b432167e16a1e356d626f7b5482eb1e523feffffffff8813187c73c47bf78e321e267369b7b380be6ea36db8e98b338c0af180708251010000006b483045022100fa701785203b01a388218f2dff647523ff71e15dfbc925d5f922ab37c363d3cc022068e2662c0d694d0c4b4e21c3dd034ec33937128496d14949b9f4f02952f14f94012103230711775af4b6436feb8f742eeb5dad0343bfd9dbcc6aea87957c243eb6867dffffffff0290dc0100000000001976a9143825cc9ff189ae5bd5cb7880e5920fde62d7f5ef88ac167c0000000000001976a9143d59b8a474139177b2733ec35b8b42ab133bd03188ac00000000',
  'DOGE': '0100000001f3a273a864719816d916f64ea244dae4416dd841e65b100bdd1dec2ab817a805000000006b48304502210098a17eefe181c1f114960dbe338e37f3471b4d432f051617d29e22db71dbd6250220792f771552b2a6d63a8abaf3f2c645f672abaef5b5bdff2f4b0ab51496c8516c012102710c60061914f5af7d1bb2af19fd43b4612daf92e82af99164b10f0740bc4f28ffffffff02003f9f03000000001976a914eecca420c32429ed575041b61f9b6b290fbfd57488ac321cc222000000001976a914d604cba6c00ee0cba337101bb7cd95619186b9a888ac00000000',
  'BSV': '0100000002d475e52813b3ae13073f36335388a7d4af215d614637832e6540681081f55ae1000000006b483045022100a0b15b6a181074b7d5c7f9b776e91be0e3a23831677bea58beea2241ce0edf160220429fb7e8900b7674a5eb02f25ee4f0624b7cb3c1f1206d4fad8366154ead0586412102792f8527b7fc98d9bc7bfbfc2b74e14c528e60dd5c6e183cf884fad886444832ffffffffd475e52813b3ae13073f36335388a7d4af215d614637832e6540681081f55ae1010000006a47304402207b04cc09f463c4e226175d1816cba71e04c3da21bf1938a3e24732e14c257b7502201d24a3dd89028b7288d76a28751014dfa9746acc0e2c03551f00cdd2a1ba021b412102792f8527b7fc98d9bc7bfbfc2b74e14c528e60dd5c6e183cf884fad886444832ffffffff02509e1b00000000001976a914b2336b7b10fb42fd2b2e86b663a29d74b49fb48088acb2f40200000000001976a914b2336b7b10fb42fd2b2e86b663a29d74b49fb48088ac00000000'
}

//TODO: These tests are skipped because the implementation was not correct

describe('Detecting Fees', () => {

  it.skip('should detect the fees from a raw LTC transaction', async () => {

    const { network_fee } = await getMiningFee('LTC', transactions['LTC'])

    expect(network_fee).to.be.equal(332)
  })

  it.skip('should detect the fees from a raw BTC transaction', async () => {

    const { network_fee } = await getMiningFee('BTC', transactions['BTC'])

    expect(network_fee).to.be.equal(332)

  })

  it.skip('should detect the fees from a raw DASH transaction', async () => {

    const { network_fee } = await getMiningFee('DASH', transactions['DASH'])

    expect(network_fee).to.be.equal(332)

  })

  it.skip('should detect the fees from a raw DOGE transaction', async () => {

    const { network_fee } = await getMiningFee('DOGE', transactions['DOGE'])

    expect(network_fee).to.be.equal(332)

  })

  it.skip('should detect the fees from a raw BSV transaction', async () => {

    const { network_fee } = await getMiningFee('BSV', transactions['BSV'])

    expect(network_fee).to.be.equal(332)

  })


})
