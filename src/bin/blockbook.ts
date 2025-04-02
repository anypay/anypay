#!/usr/bin/env ts-node

require('dotenv').config()

import { Command } from 'commander'
import { log } from '@/lib/log'
import { config } from '@/lib/config'

import { BlockbookClient } from '@anypay/blockbook';
import prisma from '@/lib/prisma';
import { getConfirmation } from '@/lib/plugins';

let client: BlockbookClient | null = null;

async function startBlockbookClient(): Promise<void> {
  const wsUrl = config.get('BLOCKBOOK_WS_URL');
  const apiKey = config.get('BLOCKBOOK_API_KEY');
  const httpUrl = config.get('BLOCKBOOK_HTTP_URL');

  console.log('WS URL', wsUrl)
  console.log('API KEY', apiKey)
  console.log('HTTP URL', httpUrl)

  if (!wsUrl || !apiKey || !httpUrl) {
    log.info('Blockbook configuration not found, skipping initialization');
    return;
  }

  try {
    client = new BlockbookClient({ wsUrl, apiKey, httpUrl });

    client.on('blockTxids', async ({ block, txids }) => {
      // Find all unconfirmed payments matching any of the txids in a single query
      const payments = await prisma.payments.findMany({
        where: { 
          txid: { in: txids },
          confirmation_hash: null
        }
      });

      console.log(`Found ${payments.length} unconfirmed payments`)

      // Process each matching payment
      for (const payment of payments) {
        try {
          const confirmation = await getConfirmation({ 
            txid: payment.txid,
            chain: payment.chain!,
            currency: payment.currency
          });
          
          if (confirmation) {
            log.info('Confirmed payment for txid', { 
              txid: payment.txid,
              chain: payment.chain,
              currency: payment.currency 
            });
          }
        } catch (error) {
          log.error('Error confirming payment:', error);
        }
      }
    });

    await client.connect();
    log.info('Blockbook client started successfully');
  } catch (error) {
    log.error('Failed to start Blockbook client:', error);
  }
}

async function stopBlockbookClient(): Promise<void> {
  if (client) {
    await client.disconnect();
    client = null;
  }
} 

const program = new Command()

program
  .name('anypay-blockbook')
  .description('Blockbook websocket listener for transaction confirmations')
  .option('--blockbook-url <url>', 'Blockbook websocket URL (overrides BLOCKBOOK_WS_URL)')
  .option('--blockbook-api-key <key>', 'Blockbook API key (overrides BLOCKBOOK_API_KEY)')
  .version('1.0.0')

program.parse()

const options = program.opts()

// Override config values with CLI options if provided
if (options.blockbookUrl) {
  config.set('BLOCKBOOK_WS_URL', options.blockbookUrl)
}
if (options.blockbookApiKey) {
  config.set('BLOCKBOOK_API_KEY', options.blockbookApiKey)
}

async function main() {
  log.info('Starting Blockbook listener...', {
    url: config.get('BLOCKBOOK_WS_URL'),
    hasApiKey: Boolean(config.get('BLOCKBOOK_API_KEY'))
  })

  try {
    await startBlockbookClient()

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      log.info('Received SIGINT, shutting down...')
      await stopBlockbookClient()
      process.exit(0)
    })

    process.on('SIGTERM', async () => {
      log.info('Received SIGTERM, shutting down...')
      await stopBlockbookClient()
      process.exit(0)
    })

    // Keep process running
    process.stdin.resume()

  } catch (error) {
    log.error('Failed to start Blockbook listener:', error)
    process.exit(1)
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  log.error('Uncaught exception:', error)
  stopBlockbookClient().then(() => process.exit(1))
})

process.on('unhandledRejection', (error) => {
  log.error('Unhandled rejection:', new Error(String(error)))
  stopBlockbookClient().then(() => process.exit(1))
})

main() 