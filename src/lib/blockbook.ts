import { config } from '@/lib/config';
import { BlockbookClient } from '@anypay/blockbook';
import { log } from '@/lib/log';
import prisma from '@/lib/prisma';
import { getConfirmation } from '@/lib/plugins';

let client: BlockbookClient | null = null;

export async function startBlockbookClient(): Promise<void> {
  const wsUrl = config.get('BLOCKBOOK_WS_URL');
  const apiKey = config.get('BLOCKBOOK_API_KEY');
  const httpUrl = config.get('BLOCKBOOK_HTTP_URL');

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

export async function stopBlockbookClient(): Promise<void> {
  if (client) {
    await client.disconnect();
    client = null;
  }
} 