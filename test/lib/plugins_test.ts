
require("dotenv").config();

import {plugins} from '../../lib/plugins';

import * as assert from 'assert';

describe("Plugins", () => {

  it('should find the plugin for BCH', async () => {

    let plugin = await plugins.find({ currency: 'BCH', chain: 'BTC' });

    assert.strictEqual(plugin.currency, 'BCH');

    assert.strictEqual(plugin.chain, 'BCH');

    assert.strictEqual(plugin.decimals, 8);

  });

  it('should find the plugin for BTC', async () => {

    let plugin = await plugins.find({ chain: 'BTC', currency: 'BTC' });

    assert.strictEqual(plugin.currency, 'BTC');

    assert.strictEqual(plugin.chain, 'BTC');

    assert.strictEqual(plugin.decimals, 8);

  });

  it('should find the plugin for DASH', async () => {

    let plugin = await plugins.find({ chain: 'DASH', currency: 'DASH' });

    assert.strictEqual(plugin.currency, 'DASH');

    assert.strictEqual(plugin.chain, 'DASH');

    assert.strictEqual(plugin.decimals, 8);

  });

  it('should find the plugin for LTC', async () => {

    let plugin = await plugins.find({ chain: 'LTC', currency: 'LTC' });

    assert.strictEqual(plugin.currency, 'LTC');

    assert.strictEqual(plugin.chain, 'LTC');

    assert.strictEqual(plugin.decimals, 8);

  });

  it('should find the plugin for DOGE', async () => {

    let plugin = await plugins.find({ chain: 'DOGE', currency: 'DOGE' });

    assert.strictEqual(plugin.currency, 'DOGE');

    assert.strictEqual(plugin.chain, 'DOGE');

    assert.strictEqual(plugin.decimals, 8);

  });

  it('should find the plugin for BSV', async () => {

    let plugin = await plugins.find({ chain: 'BSV', currency: 'BSV' });

    assert.strictEqual(plugin.currency, 'BSV');

    assert.strictEqual(plugin.chain, 'BSV');

    assert.strictEqual(plugin.decimals, 8);

  });

  it('should find the plugin for XMR', async () => {

    let plugin = await plugins.find({ chain: 'XMR', currency: 'XMR' });

    assert.strictEqual(plugin.currency, 'XMR');

    assert.strictEqual(plugin.chain, 'XMR');

    assert.strictEqual(plugin.decimals, 12);

  });

  it('should find the plugin for ETH', async () => {

    let plugin = await plugins.find({ chain: 'ETH', currency: 'ETH' })

    assert.strictEqual(plugin.currency, 'ETH')

    assert.strictEqual(plugin.chain, 'ETH')

    assert.strictEqual(plugin.decimals, 18)

    assert.strictEqual(plugin.token, '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')

  })

  it('should find the plugin for MATIC', async () => {

    let plugin = await plugins.find({ chain: 'MATIC', currency: 'MATIC' })

    assert.strictEqual(plugin.currency, 'MATIC')

    assert.strictEqual(plugin.chain, 'MATIC')

    assert.strictEqual(plugin.decimals, 18)

    assert.strictEqual(plugin.token, '0x0000000000000000000000000000000000001010')

  })

  it('should find the plugin for AVAX', async () => {

    let plugin = await plugins.find({ chain: 'AVAX', currency: 'AVAX' })

    assert.strictEqual(plugin.currency, 'AVAX')

    assert.strictEqual(plugin.chain, 'AVAX')

    assert.strictEqual(plugin.decimals, 18)

    assert.strictEqual(plugin.token, '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')

  })

  it('should find the plugin for SOL', async () => {

    let plugin = await plugins.find({ chain: 'SOL', currency: 'SOL' })

    assert.strictEqual(plugin.currency, 'SOL')

    assert.strictEqual(plugin.chain, 'SOL')

  })

  it('should find the plugin for TRON', async () => {

    let plugin = await plugins.find({ chain: 'TRON', currency: 'TRON' })

    assert.strictEqual(plugin.currency, 'TRON')

    assert.strictEqual(plugin.chain, 'TRON')

  })

  it('should find the plugin for USDC.ETH', async () => {

    let plugin = await plugins.find({ chain: 'ETH', currency: 'USDC' })

    assert.strictEqual(plugin.currency, 'USDC')

    assert.strictEqual(plugin.chain, 'ETH')

    assert.strictEqual(plugin.token, '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48')

  })

  it('should find the plugin for USDC.MATIC', async () => {

    let plugin = await plugins.find({ currency: 'USDC', chain: 'MATIC' })

    assert.strictEqual(plugin.currency, 'USDC')

    assert.strictEqual(plugin.chain, 'MATIC')

    assert.strictEqual(plugin.token, '0xc2132D05D31c914a87C6611C10748AEb04B58e8F')

  })

  it('should find the plugin for USDC.AVAX', async () => {

    let plugin = await plugins.find({ chain: 'AVAX', currency: 'USDC' })

    assert.strictEqual(plugin.currency, 'USDC')

    assert.strictEqual(plugin.chain, 'AVAX')

    assert.strictEqual(plugin.token, '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e')

  })

  it('should find the plugin for USDC.SOL', async () => {

    let plugin = await plugins.find({ chain: 'SOL', currency: 'USDC' })

    assert.strictEqual(plugin.currency, 'USDC')

    assert.strictEqual(plugin.chain, 'SOL')

    assert.strictEqual(plugin.token, 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')

  })

  it('should find the plugin for USDC.TRON', async () => {

    let plugin = await plugins.find({ chain: 'TRON', currency: 'USDC' })

    assert.strictEqual(plugin.currency, 'USDC')

    assert.strictEqual(plugin.chain, 'TRON')

    assert.strictEqual(plugin.token, 'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8')

  })

  it('should find the plugin for USDT.ETH', async () => {

    let plugin = await plugins.find({ chain: 'ETH', currency: 'USDT' })

    assert.strictEqual(plugin.currency, 'USDT')

    assert.strictEqual(plugin.chain, 'ETH')

    assert.strictEqual(plugin.token, '0xdac17f958d2ee523a2206206994597c13d831ec7')

    assert.strictEqual(plugin.decimals, 6)

  })

  it('should find the plugin for USDT.MATIC', async () => {

    let plugin = await plugins.find({ chain: 'MATIC', currency: 'USDT' })

    assert.strictEqual(plugin.currency, 'USDT')

    assert.strictEqual(plugin.chain, 'MATIC')

    assert.strictEqual(plugin.token, '0xc2132d05d31c914a87c6611c10748aeb04b58e8f')

  })

  it('should find the plugin for USDT.AVAX', async () => {

    let plugin = await plugins.find({chain: 'AVAX', currency: 'USDT' })

    assert.strictEqual(plugin.currency, 'USDT')

    assert.strictEqual(plugin.chain, 'AVAX')

    assert.strictEqual(plugin.token, '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7')

  })

  it('should find the plugin for USDT.SOL', async () => {

    let plugin = await plugins.find({ chain: 'SOL', currency: 'USDT' })

    assert.strictEqual(plugin.currency, 'USDT')

    assert.strictEqual(plugin.chain, 'SOL')

    assert.strictEqual(plugin.token, 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB')

  })

  it('should find the plugin for USDT.TRON', async () => {

    let plugin = await plugins.find({ chain: 'TRON', currency: 'USDT' })

    assert.strictEqual(plugin.currency, 'USDT')

    assert.strictEqual(plugin.chain, 'TRON')

    assert.strictEqual(plugin.token, 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t')

  })

  it('should find the plugin for XRP', async () => {

    let plugin = await plugins.find({ chain: 'XRP', currency: 'XRP' })

    assert.strictEqual(plugin.currency, 'XRP')

    assert.strictEqual(plugin.chain, 'XRP')

  })


  it('should find the plugin for XLM', async () => {

    let plugin = await plugins.find({ chain: 'XLM', currency: 'XLM' })

    assert.strictEqual(plugin.currency, 'XLM')

    assert.strictEqual(plugin.chain, 'XLM')

  })

  it('should find the plugin for USDC.XLM', async () => {

    let plugin = await plugins.find({ chain: 'XLM', currency: 'USDC' })

    assert.strictEqual(plugin.currency, 'USDC')

    assert.strictEqual(plugin.chain, 'XLM')

    assert.strictEqual(plugin.token, 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN')

  })

})

