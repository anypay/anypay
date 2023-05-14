
require("dotenv").config();

import { find } from '../../lib/plugins';

import * as assert from 'assert';

import { expect } from 'chai'

describe("Plugins", () => {

  describe('BCH', () => {

    it('should find the plugin for BCH', async () => {

      let plugin = await find({ currency: 'BCH', chain: 'BCH' });

      assert.strictEqual(plugin.currency, 'BCH');

      assert.strictEqual(plugin.chain, 'BCH');

      assert.strictEqual(plugin.decimals, 8);

    });

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

      let { depth, hash, height, timestamp } = await plugin.getConfirmation(txid)

      expect(depth).to.be.greaterThan(0)

      expect(hash).to.be.equal('00000000000000000003e7cb4d095fb3a4fb8db43196afab6408c022e73ec85f')

      expect(height).to.be.equal(789613)

      expect(timestamp).to.be.a('date')

    })

  })

  describe('DASH', () => {

    it('should find the plugin for DASH', async () => {

      let plugin = await find({ chain: 'DASH', currency: 'DASH' });

      assert.strictEqual(plugin.currency, 'DASH');

      assert.strictEqual(plugin.chain, 'DASH');

      assert.strictEqual(plugin.decimals, 8);

    });

  })

  describe('LTC', () => {

    it('should find the plugin for LTC', async () => {

      let plugin = await find({ chain: 'LTC', currency: 'LTC' });

      assert.strictEqual(plugin.currency, 'LTC');

      assert.strictEqual(plugin.chain, 'LTC');

      assert.strictEqual(plugin.decimals, 8);

    });

  })

  describe('DOGE', () => {

    it('should find the plugin for DOGE', async () => {

      let plugin = await find({ chain: 'DOGE', currency: 'DOGE' });

      assert.strictEqual(plugin.currency, 'DOGE');

      assert.strictEqual(plugin.chain, 'DOGE');

      assert.strictEqual(plugin.decimals, 8);

    });

  })

  describe('BSV', () => {

    it('should find the plugin for BSV', async () => {

      let plugin = await find({ chain: 'BSV', currency: 'BSV' });

      assert.strictEqual(plugin.currency, 'BSV');

      assert.strictEqual(plugin.chain, 'BSV');

      assert.strictEqual(plugin.decimals, 8);

    });

  })

  describe('XMR', () => {

    it('should find the plugin for XMR', async () => {

      let plugin = await find({ chain: 'XMR', currency: 'XMR' });

      assert.strictEqual(plugin.currency, 'XMR');

      assert.strictEqual(plugin.chain, 'XMR');

      assert.strictEqual(plugin.decimals, 12);

    });

  })

  describe('ETH', () => {

    it('should find the plugin for ETH', async () => {

      let plugin = await find({ chain: 'ETH', currency: 'ETH' })

      assert.strictEqual(plugin.currency, 'ETH')

      assert.strictEqual(plugin.chain, 'ETH')

      assert.strictEqual(plugin.decimals, 18)

    })

  })

  describe('MATIC', () => {

    it('should find the plugin for MATIC', async () => {

      let plugin = await find({ chain: 'MATIC', currency: 'MATIC' })

      assert.strictEqual(plugin.currency, 'MATIC')

      assert.strictEqual(plugin.chain, 'MATIC')

      assert.strictEqual(plugin.decimals, 18)

    })

  })

  describe('AVAX', () => {

    it('should find the plugin for AVAX', async () => {

      let plugin = await find({ chain: 'AVAX', currency: 'AVAX' })

      assert.strictEqual(plugin.currency, 'AVAX')

      assert.strictEqual(plugin.chain, 'AVAX')

      assert.strictEqual(plugin.decimals, 18)

    })

  })

  describe('SOL', () => {

    it('should find the plugin for SOL', async () => {

      let plugin = await find({ chain: 'SOL', currency: 'SOL' })

      assert.strictEqual(plugin.currency, 'SOL')

      assert.strictEqual(plugin.chain, 'SOL')

    })

  })

  describe('TRON', () => {

    it('should find the plugin for TRON', async () => {

      let plugin = await find({ chain: 'TRON', currency: 'TRON' })

      assert.strictEqual(plugin.currency, 'TRON')

      assert.strictEqual(plugin.chain, 'TRON')

    })

  })

  describe('XRP', () => {

    it('should find the plugin for XRP', async () => {

      let plugin = await find({ chain: 'XRP', currency: 'XRP' })

      assert.strictEqual(plugin.currency, 'XRP')

      assert.strictEqual(plugin.chain, 'XRP')

    })

  })

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

  describe('USDC', () => {

    it('should find the plugin for USDC.ETH', async () => {

      let plugin = await find({ chain: 'ETH', currency: 'USDC' })

      assert.strictEqual(plugin.currency, 'USDC')

      assert.strictEqual(plugin.chain, 'ETH')

      assert.strictEqual(plugin.token, '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48')

    })

    it('should find the plugin for USDC.MATIC', async () => {

      let plugin = await find({ currency: 'USDC', chain: 'MATIC' })

      assert.strictEqual(plugin.currency, 'USDC')

      assert.strictEqual(plugin.chain, 'MATIC')

      assert.strictEqual(plugin.token, '0x2791bca1f2de4661ed88a30c99a7a9449aa84174')

    })

    it('should find the plugin for USDC.AVAX', async () => {

      let plugin = await find({ chain: 'AVAX', currency: 'USDC' })

      assert.strictEqual(plugin.currency, 'USDC')

      assert.strictEqual(plugin.chain, 'AVAX')

      assert.strictEqual(plugin.token, '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e')

    })

    it('should find the plugin for USDC.SOL', async () => {

      let plugin = await find({ chain: 'SOL', currency: 'USDC' })

      assert.strictEqual(plugin.currency, 'USDC')

      assert.strictEqual(plugin.chain, 'SOL')

      assert.strictEqual(plugin.token, 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')

    })

    it('should find the plugin for USDC.TRON', async () => {

      let plugin = await find({ chain: 'TRON', currency: 'USDC' })

      assert.strictEqual(plugin.currency, 'USDC')

      assert.strictEqual(plugin.chain, 'TRON')

      assert.strictEqual(plugin.token, 'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8')

    })

    it('should find the plugin for USDC.FLOW', async () => {

      let plugin = await find({ chain: 'FLOW', currency: 'USDC' })

      assert.strictEqual(plugin.currency, 'USDC')

      assert.strictEqual(plugin.chain, 'FLOW')

      assert.strictEqual(plugin.token, 'A.b19436aae4d94622.FiatToken')

    })

    it('should find the plugin for USDC.HBAR', async () => {

      let plugin = await find({ chain: 'HBAR', currency: 'USDC' })

      assert.strictEqual(plugin.currency, 'USDC')

      assert.strictEqual(plugin.chain, 'HBAR')

      assert.strictEqual(plugin.token, '0.0.456858')

    })

    it('should find the plugin for USDC.XLM', async () => {

      let plugin = await find({ chain: 'XLM', currency: 'USDC' })

      assert.strictEqual(plugin.currency, 'USDC')

      assert.strictEqual(plugin.chain, 'XLM')

      assert.strictEqual(plugin.token, 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN')

    })

  })

  describe('USDT', () => {

    it('should find the plugin for USDT.ETH', async () => {

      let plugin = await find({ chain: 'ETH', currency: 'USDT' })

      assert.strictEqual(plugin.currency, 'USDT')

      assert.strictEqual(plugin.chain, 'ETH')

      assert.strictEqual(plugin.token, '0xdac17f958d2ee523a2206206994597c13d831ec7')

      assert.strictEqual(plugin.decimals, 6)

    })

    it('should find the plugin for USDT.MATIC', async () => {

      let plugin = await find({ chain: 'MATIC', currency: 'USDT' })

      assert.strictEqual(plugin.currency, 'USDT')

      assert.strictEqual(plugin.chain, 'MATIC')

      assert.strictEqual(plugin.token, '0xc2132d05d31c914a87c6611c10748aeb04b58e8f')

    })

    it('should find the plugin for USDT.AVAX', async () => {

      let plugin = await find({chain: 'AVAX', currency: 'USDT' })

      assert.strictEqual(plugin.currency, 'USDT')

      assert.strictEqual(plugin.chain, 'AVAX')

      assert.strictEqual(plugin.token, '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7')

    })

    it('should find the plugin for USDT.SOL', async () => {

      let plugin = await find({ chain: 'SOL', currency: 'USDT' })

      assert.strictEqual(plugin.currency, 'USDT')

      assert.strictEqual(plugin.chain, 'SOL')

      assert.strictEqual(plugin.token, 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB')

    })

    it('should find the plugin for USDT.TRON', async () => {

      let plugin = await find({ chain: 'TRON', currency: 'USDT' })

      assert.strictEqual(plugin.currency, 'USDT')

      assert.strictEqual(plugin.chain, 'TRON')

      assert.strictEqual(plugin.token, 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t')

    })

  })

})

