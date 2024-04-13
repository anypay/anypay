
require("dotenv").config();

import { find } from '../../lib/plugins';

import { initialize } from '../../lib';

import * as assert from 'assert';

import { expect } from 'chai'
import { Confirmation } from '../../lib/confirmations';

describe("Plugins", () => {

  before(async () => {

    await initialize()

  })

  describe('BCH', () => {

    it('should find the plugin for BCH', async () => {

      let plugin = await find({ currency: 'BCH', chain: 'BCH' });

      assert.strictEqual(plugin.currency, 'BCH');

      assert.strictEqual(plugin.chain, 'BCH');

      assert.strictEqual(plugin.decimals, 8);

    });

    it('#getConfirmation should return block data for confirmed transaction', async () => {

      let plugin = await find({ chain: 'BCH', currency: 'BCH' });

      let txid = '4e51acd9be7d61955838cf4ec20a294465d612f485c6615c5777b7b52320ba4f'

      let { confirmations, confirmation_hash, confirmation_height, confirmation_date } = await plugin.getConfirmation(txid) as Confirmation

      expect(confirmations).to.be.greaterThan(0)

      expect(confirmation_hash).to.be.equal('000000000000000002a18e30eb35e7c9d12a5daa9d5ebe840d39e39ca4ac29ce')

      expect(confirmation_height).to.be.equal(792678)

      expect(confirmation_date).to.be.a('date')

    })

  })

  describe('BTC', () => {

    it('should find the plugin for BTC', async () => {

      let plugin = await find({ chain: 'BTC', currency: 'BTC' });

      assert.strictEqual(plugin.currency, 'BTC');

      assert.strictEqual(plugin.chain, 'BTC');

      assert.strictEqual(plugin.decimals, 8);

      expect(plugin.broadcastTx).to.be.a('function')

    });

    it('#getConfirmation should return block data for confirmed transaction', async () => {

      let plugin = await find({ chain: 'BTC', currency: 'BTC' });

      let txid = 'ffa3a4e7169bdc61a509a1bbf8a560c21a04ee6783cdec23f3d28910d5407d02'

      let { confirmations, confirmation_hash, confirmation_height, confirmation_date } = await plugin.getConfirmation(txid) as Confirmation

      expect(confirmations).to.be.greaterThan(0)

      expect(confirmation_hash).to.be.equal('00000000000000000003e7cb4d095fb3a4fb8db43196afab6408c022e73ec85f')

      expect(confirmation_height).to.be.equal(789613)

      expect(confirmation_date).to.be.a('date')

    })

  })

  describe('DASH', () => {

    it('should find the plugin for DASH', async () => {

      let plugin = await find({ chain: 'DASH', currency: 'DASH' });

      assert.strictEqual(plugin.currency, 'DASH');

      assert.strictEqual(plugin.chain, 'DASH');

      assert.strictEqual(plugin.decimals, 8);

    });

    it('#getConfirmation should return block data for confirmed transaction', async () => {

      let plugin = await find({ chain: 'DASH', currency: 'DASH' });

      let txid = '1eb4e53d410c4a7e44e6d80484756791052a0c79c35151bffb1bed970323a6b1'

      let { confirmations, confirmation_hash, confirmation_height, confirmation_date } = await plugin.getConfirmation(txid) as Confirmation

      expect(confirmations).to.be.greaterThan(0)

      expect(confirmation_hash).to.be.equal('0000000000000008dc00e5b8eba00897b0b3e50ab0e6fe1d16818d13fe8232a1')

      expect(confirmation_height).to.be.equal(1870467)

      expect(confirmation_date).to.be.a('date')

    })

  })

  describe('LTC', () => {

    it('should find the plugin for LTC', async () => {

      let plugin = await find({ chain: 'LTC', currency: 'LTC' });

      assert.strictEqual(plugin.currency, 'LTC');

      assert.strictEqual(plugin.chain, 'LTC');

      assert.strictEqual(plugin.decimals, 8);

    });

    it('#getConfirmation should return block data for confirmed transaction', async () => {

      let plugin = await find({ chain: 'LTC', currency: 'LTC' });

      let txid = '6bab5b587ce5ea0938c1477c1f6c6cd38dc2cc58f9b52e7d93c24320ad1f0388'

      let { confirmations, confirmation_hash, confirmation_height, confirmation_date } = await plugin.getConfirmation(txid) as Confirmation

      expect(confirmations).to.be.greaterThan(0)

      expect(confirmation_hash).to.be.equal('98a2a60c30e30960296b454d69d85d1905953d571f90f2befa0f0dd7c7631d3e')

      expect(confirmation_height).to.be.equal(2473321)

      expect(confirmation_date).to.be.a('date')

    })



  })

  describe('DOGE', () => {

    it('should find the plugin for DOGE', async () => {

      let plugin = await find({ chain: 'DOGE', currency: 'DOGE' });

      assert.strictEqual(plugin.currency, 'DOGE');

      assert.strictEqual(plugin.chain, 'DOGE');

      assert.strictEqual(plugin.decimals, 8);

    });

    it('#getConfirmation should return block data for confirmed transaction', async () => {

      let plugin = await find({ chain: 'DOGE', currency: 'DOGE' });

      let txid = '4c8adb87aa5d2c3c16880afea9b7c34040e064463f3a19341d838386bc859bd3'

      let { confirmations, confirmation_hash, confirmation_height, confirmation_date } = await plugin.getConfirmation(txid) as Confirmation

      expect(confirmations).to.be.greaterThan(0)

      expect(confirmation_hash).to.be.equal('d52fc7ea1b838c4ed9d9ad30c123cd18e25f842129c21a887736d3f2eef8439f')

      expect(confirmation_height).to.be.equal(4716421)

      expect(confirmation_date).to.be.a('date')

    })

  })

  describe('BSV', () => {

    it('should find the plugin for BSV', async () => {

      let plugin = await find({ chain: 'BSV', currency: 'BSV' });

      assert.strictEqual(plugin.currency, 'BSV');

      assert.strictEqual(plugin.chain, 'BSV');

      assert.strictEqual(plugin.decimals, 8);

    });

    it('#getConfirmation should return block data for confirmed transaction', async () => {

      let plugin = await find({ chain: 'BSV', currency: 'BSV' });

      let txid = 'de2b352e1849392a7fce7a8fa2f6295d922307303b007d3804f9589b66624028'

      let { confirmations, confirmation_hash, confirmation_height, confirmation_date } = await plugin.getConfirmation(txid) as Confirmation

      expect(confirmations).to.be.greaterThan(0)

      expect(confirmation_hash).to.be.equal('0000000000000000003a7c1fa88eb6134c0f8b4027e1b1e753079181a462d99a')

      expect(confirmation_height).to.be.equal(791940)

      expect(confirmation_date).to.be.a('date')

    })



  })

  describe('XMR', () => {

    it('should find the plugin for XMR', async () => {

      let plugin = await find({ chain: 'XMR', currency: 'XMR' });

      assert.strictEqual(plugin.currency, 'XMR');

      assert.strictEqual(plugin.chain, 'XMR');

      assert.strictEqual(plugin.decimals, 12);

    });

    // TODO enable this test once XMR is back online
    xit('#getConfirmation should return block data for confirmed transaction', async () => {

      let plugin = await find({ chain: 'XMR', currency: 'XMR' });

      let txid = '58f8df857270cfc783c7dfb5e58c69e8dee5b9113242b52cefc62b4296fbcec3'

      let { confirmations, confirmation_hash, confirmation_height, confirmation_date } = await plugin.getConfirmation(txid) as Confirmation

      expect(confirmations).to.be.greaterThan(0)

      expect(confirmation_hash).to.be.equal('cc3d8eace4332c99e13aa915c1f7521490c3f91054cfc7500fce6ec58f66c98a')

      expect(confirmation_height).to.be.equal(2885963)

      expect(confirmation_date).to.be.a('date')

    })

  })

  describe('ETH', () => {

    it('should find the plugin for ETH', async () => {

      let plugin = await find({ chain: 'ETH', currency: 'ETH' })

      assert.strictEqual(plugin.currency, 'ETH')

      assert.strictEqual(plugin.chain, 'ETH')

      assert.strictEqual(plugin.decimals, 18)

    })

    it('#getConfirmation should return block data for confirmed transaction', async () => {

      let plugin = await find({ chain: 'ETH', currency: 'ETH' });

      let txid = '0xcd43123eea81e3b9e2227d6468f6f6ad174e90e6f793b2302c7b03f04604381b'

      let { confirmations, confirmation_hash, confirmation_height, confirmation_date } = await plugin.getConfirmation(txid) as Confirmation

      expect(confirmations).to.be.greaterThan(0)

      expect(confirmation_hash).to.be.equal('0x5b192061e9a046cb05f7f72f5d71bcca2d53cc7083d3a738163f7e155ec6fa05')

      expect(confirmation_height).to.be.equal(17255716)

      expect(confirmation_date).to.be.a('date')

    })

  })

  describe('MATIC', () => {

    it('should find the plugin for MATIC', async () => {

      let plugin = await find({ chain: 'MATIC', currency: 'MATIC' })

      assert.strictEqual(plugin.currency, 'MATIC')

      assert.strictEqual(plugin.chain, 'MATIC')

      assert.strictEqual(plugin.decimals, 18)

    })

    it('#getConfirmation should return block data for confirmed transaction', async () => {

      let plugin = await find({ chain: 'MATIC', currency: 'MATIC' });

      let txid = '0x494011badb5faf691bc11027c96e154da6d8ee3ab2dd70ce346900b8153b4d1c'

      let { confirmations, confirmation_hash, confirmation_height, confirmation_date } = await plugin.getConfirmation(txid) as Confirmation

      expect(confirmations).to.be.greaterThan(0)

      expect(confirmation_hash).to.be.equal('0xde5a4703ca10f3176be78ee832881bfc3bae5600f06924f82ab4951b29271573')

      expect(confirmation_height).to.be.equal(42680415)

      expect(confirmation_date).to.be.a('date')

    })

  })

  describe('AVAX', () => {

    it('should find the plugin for AVAX', async () => {

      let plugin = await find({ chain: 'AVAX', currency: 'AVAX' })

      assert.strictEqual(plugin.currency, 'AVAX')

      assert.strictEqual(plugin.chain, 'AVAX')

      assert.strictEqual(plugin.decimals, 18)

    })

    it('#getConfirmation should return block data for confirmed transaction', async () => {

      let plugin = await find({ chain: 'AVAX', currency: 'USDC' });

      let txid = '0x08374e97eb817fdbd8eb8eddb6e2f4693436dafbdfb7dd2adb4c07300c7a253e'

      let { confirmations, confirmation_hash, confirmation_height, confirmation_date } = await plugin.getConfirmation(txid) as Confirmation

      expect(confirmations).to.be.greaterThan(0)

      expect(confirmation_hash).to.be.equal('0x195e761cecea1cf5d9faf4540a87b685449439f9df65216536b1dddbd1ec3544')

      expect(confirmation_height).to.be.equal(29994194)

      expect(confirmation_date).to.be.a('date')

    })

  })

  describe('SOL', () => {

    it.skip('should find the plugin for SOL', async () => {

      let plugin = await find({ chain: 'SOL', currency: 'SOL' })

      assert.strictEqual(plugin.currency, 'SOL')

      assert.strictEqual(plugin.chain, 'SOL')

    })

    it.skip('#getConfirmation should return block data for confirmed transaction', async () => {

      let plugin = await find({ chain: 'SOL', currency: 'SOL' });

      let txid = 'sva4wpWvkuE2vLeGDHdDdxorYNWVz8p74uyR1i1FnHUudK94hCgh7qKWrRW6hnFaVAFkUQp9AX6jVD5BkuNNFvv'

      let { confirmations, confirmation_hash, confirmation_height, confirmation_date } = await plugin.getConfirmation(txid) as Confirmation

      expect(confirmations).to.be.greaterThan(0)

      expect(confirmation_hash).to.be.equal('6whs717Kr48RW3j2ocsWrW9BiGkSeLFNfnMXN23WAAHL')

      expect(confirmation_height).to.be.equal(193936012)

      expect(confirmation_date).to.be.a('date')

    })

  })

  describe('TRON', () => {

    it.skip('should find the plugin for TRON', async () => {

      let plugin = await find({ chain: 'TRON', currency: 'TRON' })

      assert.strictEqual(plugin.currency, 'TRON')

      assert.strictEqual(plugin.chain, 'TRON')

    })

    it.skip('#getConfirmation should return block data for confirmed transaction', async () => {

      let plugin = await find({ chain: 'TRON', currency: 'TRON' });

      let txid = 'f6fe081a567701931e01555e20cc8f00bcfdef056df92d262480620568d6f9cb'

      let { confirmations, confirmation_hash, confirmation_height, confirmation_date } = await plugin.getConfirmation(txid) as Confirmation

      expect(confirmations).to.be.greaterThan(0)

      expect(confirmation_hash).to.be.equal('00000000030c5eb3e4e7d51c0ed80a2456b9142f41426a94daf601779dca2777')

      expect(confirmation_height).to.be.equal(51142323)

      expect(confirmation_date).to.be.a('date')

    })

  })

  describe('XRP', () => {

    it('should find the plugin for XRP', async () => {

      let plugin = await find({ chain: 'XRP', currency: 'XRP' })

      assert.strictEqual(plugin.currency, 'XRP')

      assert.strictEqual(plugin.chain, 'XRP')

    })

    it('#getConfirmation should return block data for confirmed transaction', async () => {

      let plugin = await find({ chain: 'XRP', currency: 'XRP' });

      let txid = '8F3A872BA256DAEAB6634E6CFE346DD0F02347C28DF37A3B4D26FB6D29CA9C2D'

      let { confirmations, confirmation_hash, confirmation_height, confirmation_date } = await plugin.getConfirmation(txid) as Confirmation

      expect(confirmations).to.be.greaterThan(0)

      expect(confirmation_hash).to.be.equal('13B9FFF7C1A0D5C36DA1442130F2AA3D2537C414CDDB9A2FFEEE918D89CC458D')

      expect(confirmation_height).to.be.equal(79781368)

      expect(confirmation_date).to.be.a('date')

    })

  })
/*

  describe('XLM', () => {

    it('should find the plugin for XLM', async () => {

      let plugin = await find({ chain: 'XLM', currency: 'XLM' })

      assert.strictEqual(plugin.currency, 'XLM')

      assert.strictEqual(plugin.chain, 'XLM')

    })

  })

  describe('FLOW', () => {

    it('should find the plugin for FLOW', async () => {

      let plugin = await find({ chain: 'FLOW', currency: 'FLOW' })

      assert.strictEqual(plugin.currency, 'FLOW')

      assert.strictEqual(plugin.chain, 'FLOW')

    })

  })

  describe('HBAR', () => {

    it('should find the plugin for HBAR', async () => {

      let plugin = await find({ chain: 'HBAR', currency: 'HBAR' })

      assert.strictEqual(plugin.currency, 'HBAR')

      assert.strictEqual(plugin.chain, 'HBAR')

    })

  })

*/

  describe('USDC', () => {

    describe('USDC.ETH', () => {

      it('should find the plugin for USDC.ETH', async () => {

        let plugin = await find({ chain: 'ETH', currency: 'USDC' })

        assert.strictEqual(plugin.currency, 'USDC')

        assert.strictEqual(plugin.chain, 'ETH')

        assert.strictEqual(plugin.token, '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48')

      })

      it('#getConfirmation should return block data for confirmed transaction', async () => {

        let plugin = await find({ chain: 'ETH', currency: 'USDC' });

        let txid = '0x49bfaf3135b1b8c1a45e334706ca089826e7043d7feb7326d3d02206e1eae5a6'

        let { confirmations, confirmation_hash, confirmation_height, confirmation_date } = await plugin.getConfirmation(txid) as Confirmation

        expect(confirmations).to.be.greaterThan(0)

        expect(confirmation_hash).to.be.equal('0x5b192061e9a046cb05f7f72f5d71bcca2d53cc7083d3a738163f7e155ec6fa05')

        expect(confirmation_height).to.be.equal(17255716)

        expect(confirmation_date).to.be.a('date')

      })

    })

    describe('USDC.MATIC', () => {

      it('should find the plugin for USDC.MATIC', async () => {

        let plugin = await find({ currency: 'USDC', chain: 'MATIC' })

        assert.strictEqual(plugin.currency, 'USDC')

        assert.strictEqual(plugin.chain, 'MATIC')

        assert.strictEqual(plugin.token, '0x2791bca1f2de4661ed88a30c99a7a9449aa84174')

      })

      it('#getConfirmation should return block data for confirmed transaction', async () => {

        let plugin = await find({ chain: 'MATIC', currency: 'USDC' });

        let txid = '0x7fa214be78f449b5c2ce854688a4244bfa6039971edea30f46ee535636fed0a0'

        let { confirmations, confirmation_hash, confirmation_height, confirmation_date } = await plugin.getConfirmation(txid) as Confirmation

        expect(confirmations).to.be.greaterThan(0)

        expect(confirmation_hash).to.be.equal('0x01a9acc2827368254847ff96169257db4c756e08647db003c808e99306382df3')

        expect(confirmation_height).to.be.equal(42679642)

        expect(confirmation_date).to.be.a('date')

      })

    })

    describe('USDC.AVAX', () => {

      it('should find the plugin for USDC.AVAX', async () => {

        let plugin = await find({ chain: 'AVAX', currency: 'USDC' })

        assert.strictEqual(plugin.currency, 'USDC')

        assert.strictEqual(plugin.chain, 'AVAX')

        assert.strictEqual(plugin.token, '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e')

      })

      it('#getConfirmation should return block data for confirmed transaction', async () => {

        let plugin = await find({ chain: 'AVAX', currency: 'USDC' });

        let txid = '0x08374e97eb817fdbd8eb8eddb6e2f4693436dafbdfb7dd2adb4c07300c7a253e'

        let { confirmations, confirmation_hash, confirmation_height, confirmation_date } = await plugin.getConfirmation(txid) as Confirmation

        expect(confirmations).to.be.greaterThan(0)

        expect(confirmation_hash).to.be.equal('0x195e761cecea1cf5d9faf4540a87b685449439f9df65216536b1dddbd1ec3544')

        expect(confirmation_height).to.be.equal(29994194)

        expect(confirmation_date).to.be.a('date')

      })

    })

    /*

    describe('USDC.SOL', () => {

      it('should find the plugin for USDC.SOL', async () => {

        let plugin = await find({ chain: 'SOL', currency: 'USDC' })

        assert.strictEqual(plugin.currency, 'USDC')

        assert.strictEqual(plugin.chain, 'SOL')

        assert.strictEqual(plugin.token, 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')

      })

      it('#getConfirmation should return block data for confirmed transaction', async () => {

        let plugin = await find({ chain: 'SOL', currency: 'USDC' });

        let txid = 'sva4wpWvkuE2vLeGDHdDdxorYNWVz8p74uyR1i1FnHUudK94hCgh7qKWrRW6hnFaVAFkUQp9AX6jVD5BkuNNFvv'

        let { confirmations, confirmation_hash, confirmation_height, confirmation_date } = await plugin.getConfirmation(txid)

        expect(confirmations).to.be.greaterThan(0)

        expect(confirmation_hash).to.be.equal('6whs717Kr48RW3j2ocsWrW9BiGkSeLFNfnMXN23WAAHL')

        expect(confirmation_height).to.be.equal(193936012)

        expect(confirmation_date).to.be.a('date')

      })


    })

    describe('USDC.TRON', () => {

      it.skip('should find the plugin for USDC.TRON', async () => {

        let plugin = await find({ chain: 'TRON', currency: 'USDC' })

        assert.strictEqual(plugin.currency, 'USDC')

        assert.strictEqual(plugin.chain, 'TRON')

        assert.strictEqual(plugin.token, 'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8')

      })

      it.skip('#getConfirmation should return block data for confirmed transaction', async () => {

        let plugin = await find({ chain: 'TRON', currency: 'USDT' });

        let txid = '96ca9572aad4c23a7545ea02661d6d1f3def87cc6bfe604529a9c85f59afe097'

        let { confirmations, confirmation_hash, confirmation_height, confirmation_date } = await plugin.getConfirmation(txid)

        expect(confirmations).to.be.greaterThan(0)

        expect(confirmation_hash).to.be.equal('00000000030c5c3a40dec96e91cb370d9ad63f8140c5428e515ab419fdba309d')

        expect(confirmation_height).to.be.equal(51141690)

        expect(confirmation_date).to.be.a('date')

      })

    })

    describe('USDC.FLOW', () => {

      it.skip('should find the plugin for USDC.FLOW', async () => {

        let plugin = await find({ chain: 'FLOW', currency: 'USDC' })

        assert.strictEqual(plugin.currency, 'USDC')

        assert.strictEqual(plugin.chain, 'FLOW')

        assert.strictEqual(plugin.token, 'A.b19436aae4d94622.FiatToken')

      })

    })

    describe('USDC.HBAR', () => {

      it('should find the plugin for USDC.HBAR', async () => {

        let plugin = await find({ chain: 'HBAR', currency: 'USDC' })

        assert.strictEqual(plugin.currency, 'USDC')

        assert.strictEqual(plugin.chain, 'HBAR')

        assert.strictEqual(plugin.token, '0.0.456858')

      })

    })

    describe('USDC.XLM', () => {

      it('should find the plugin for USDC.XLM', async () => {

        let plugin = await find({ chain: 'XLM', currency: 'USDC' })

        assert.strictEqual(plugin.currency, 'USDC')

        assert.strictEqual(plugin.chain, 'XLM')

        assert.strictEqual(plugin.token, 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN')

      })

    })
    */

  })

  describe('USDT', () => {

    describe('USDT.ETH', () => {

      it('should find the plugin for USDT.ETH', async () => {

        let plugin = await find({ chain: 'ETH', currency: 'USDT' })

        assert.strictEqual(plugin.currency, 'USDT')

        assert.strictEqual(plugin.chain, 'ETH')

        assert.strictEqual(plugin.token, '0xdac17f958d2ee523a2206206994597c13d831ec7')

        assert.strictEqual(plugin.decimals, 6)

      })

      it('#getConfirmation should return block data for confirmed transaction', async () => {

        let plugin = await find({ chain: 'ETH', currency: 'USDT' });

        let txid = '0xf24f352490d539085f2114ed1f35fe8a664f1a27f4587429cbcf7e56926b0eeb'

        let { confirmations, confirmation_hash, confirmation_height, confirmation_date } = await plugin.getConfirmation(txid) as Confirmation

        expect(confirmations).to.be.greaterThan(0)

        expect(confirmation_hash).to.be.equal('0x444e405425339f6a17cba63c822af4a72f6337542db5642592fbb31cfd8d801d')

        expect(confirmation_height).to.be.equal(17247170)

        expect(confirmation_date).to.be.a('date')

      })

    })

    describe('USDT.MATIC', () => {

      it('should find the plugin for USDT.MATIC', async () => {

        let plugin = await find({ chain: 'MATIC', currency: 'USDT' })

        assert.strictEqual(plugin.currency, 'USDT')

        assert.strictEqual(plugin.chain, 'MATIC')

        assert.strictEqual(plugin.token, '0xc2132d05d31c914a87c6611c10748aeb04b58e8f')

      })

      it('#getConfirmation should return block data for confirmed transaction', async () => {

        let plugin = await find({ chain: 'MATIC', currency: 'USDT' });

        let txid = '0x0d66c0c4a13e2c525fe9fa3929078e55df7d17cb3d58ad419f05449d0b56ec2c'

        let { confirmations, confirmation_hash, confirmation_height, confirmation_date } = await plugin.getConfirmation(txid) as Confirmation

        expect(confirmations).to.be.greaterThan(0)

        expect(confirmation_hash).to.be.equal('0xd51998fb091e2cce9e3684f5f45cc56a2deb09bd0f51514b426abd04be2f85d4')

        expect(confirmation_height).to.be.equal(42680347)

        expect(confirmation_date).to.be.a('date')

      })



    })

    describe('USDT.AVAX', () => {

      it('should find the plugin for USDT.AVAX', async () => {

        let plugin = await find({chain: 'AVAX', currency: 'USDT' })

        assert.strictEqual(plugin.currency, 'USDT')

        assert.strictEqual(plugin.chain, 'AVAX')

        assert.strictEqual(plugin.token, '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7')

      })

      it('#getConfirmation should return block data for confirmed transaction', async () => {

        let plugin = await find({ chain: 'AVAX', currency: 'USDT' });

        let txid = '0x8cf9a0048f4536a6eec4f277ae4aa61e6569d7c3c3eb9d28a9d153ebe90683a2'

        let { confirmations, confirmation_hash, confirmation_height, confirmation_date } = await plugin.getConfirmation(txid) as Confirmation

        expect(confirmations).to.be.greaterThan(0)

        expect(confirmation_hash).to.be.equal('0x91fffe943de27a50c45c09fe6d90418af26fab4904f09cd497475f123ee877df')

        expect(confirmation_height).to.be.equal(29994293)

        expect(confirmation_date).to.be.a('date')

      })



    })

    /*

    describe('USDT.SOL', () => {

      it('should find the plugin for USDT.SOL', async () => {

        let plugin = await find({ chain: 'SOL', currency: 'USDT' })

        assert.strictEqual(plugin.currency, 'USDT')

        assert.strictEqual(plugin.chain, 'SOL')

        assert.strictEqual(plugin.token, 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB')

      })

      it('#getConfirmation should return block data for confirmed transaction', async () => {

        let plugin = await find({ chain: 'SOL', currency: 'USDT' });

        let txid = '3saePwvDwQZxUk4XMmRL3Taw23fRNmv2auQUxCGvWCeqvTBff9nWAepAU7UHMmuQWemrKB2edWbY7LXg9Uwp8U46'

        let { confirmations, confirmation_hash, confirmation_height, confirmation_date } = await plugin.getConfirmation(txid)

        expect(confirmations).to.be.greaterThan(0)

        expect(confirmation_hash).to.be.equal('FNhzxG5N5XQCGqnYK7coTJAoUEqLuN7Mo6ttcPHaoq2D')

        expect(confirmation_height).to.be.equal(193945797)

        expect(confirmation_date).to.be.a('date')

      })



    })

    describe('USDT.TRON', () => {

      it('should find the plugin for USDT.TRON', async () => {

        let plugin = await find({ chain: 'TRON', currency: 'USDT' })

        assert.strictEqual(plugin.currency, 'USDT')

        assert.strictEqual(plugin.chain, 'TRON')

        assert.strictEqual(plugin.token, 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t')

      })

      it('#getConfirmation should return block data for confirmed transaction', async () => {

        let plugin = await find({ chain: 'TRON', currency: 'USDT' });

        let txid = '56e33d3633e6756cd66d630b9cdae3ebce2dd78e419c9e820fc982becca2a1a4'

        let { confirmations, confirmation_hash, confirmation_height, confirmation_date } = await plugin.getConfirmation(txid)

        expect(confirmations).to.be.greaterThan(0)

        expect(confirmation_hash).to.be.equal('00000000030c5bfbd0ed1ced5f70d9b6941bb5b210c2b406500e542134140373')

        expect(confirmation_height).to.be.equal(51141627)

        expect(confirmation_date).to.be.a('date')

      })

    })

    */

  })

})

