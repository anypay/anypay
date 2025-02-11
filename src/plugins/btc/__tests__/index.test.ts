import BTC from '../index'
import { Transaction } from '@/lib/plugin'

describe('BTC Plugin', () => {
  describe('parsePayments', () => {
    it('should parse payments to SegWit addresses', async () => {
      const plugin = new BTC()
      
      const tx: Transaction = {
        txhex: '02000000000101b019e7c4b4129c3f8e6442e8780f72cd5bb8c5c4407c0490e52e89e7d3116f990100000000fdffffff0222020000000000001600149b42f71ead4db02f6ac51826f43b3bcb6268d3aa102700000000000016001433925cf321d9d456e8e82d926c89a9ea4c316d6f02473044022072acc8937b1dd24a85c0e08b11c5f2d4141c5bace643efc85dc0f1fe5cee6a1b02207b3f5b8307f1bdb3ea26f9c9c4c7272e404509cf58d0d0b0f39702db0c3751d1012103d6d1853e60811e0e7ad42a3a033e5b0ed16c4c3cd696c9e1b2e80a147d706faf00000000'
      }

      const payments = await plugin.parsePayments(tx)

      expect(payments).toEqual([
        {
          address: 'bc1q9x8lp3w6n2dhz50jc58rqsqqe32nh0c8qwx2xt',
          amount: 546,
          chain: 'BTC',
          currency: 'BTC'
        },
        {
          address: 'bc1qz3f43gm0y95rz9a7q68k2dzhgg9m5czrxneyc4',
          amount: 10000,
          chain: 'BTC',
          currency: 'BTC'
        }
      ])
    })

    it('should parse payment to specific Taproot address', async () => {
      const plugin = new BTC()
      
      const tx: Transaction = {
        txhex: '02000000000101e4c0fc53c8e58a50d8699e796dcc9ecffcdcf5d4266e15b1e82e403dfcd768b70100000000fdffffff0119130000000000002251206807819ba761b4827a9b4b5323d43cb9929bd520aeaf14583a919ad7b25883490140d8cf50ff4f30a008237a975d426afce3ed296448d0232575aff4c8544d6fdd6c3705b26d13d2956f5373cac75fecf23cdb3910efffbed353061b2ac9d06d3998be0f0c00'
      }

      const payments = await plugin.parsePayments(tx)

      expect(payments).toEqual([
        {
          address: 'bc1pdqrcrxa8vx6gy75mfdfj84puhxffh4fq46h3gkp6jxdd0vjcsdyspfxcv6',
          amount: 4889,
          chain: 'BTC',
          currency: 'BTC'
        },
      ])
    })
  })
}) 