#!/usr/bin/env node

require('dotenv').config();
import { Command } from 'commander';
import { BlockbookClient } from '../client';

const program = new Command();

program
  .name('blockbook')
  .description('Blockbook websocket listener for transaction confirmations')
  .option('--ws-url <url>', 'Blockbook websocket URL')
  .option('--http-url <url>', 'Blockbook HTTP URL')
  .option('--api-key <key>', 'Blockbook API key')
  .version('1.0.0');

program
  .command('process-block')
  .description('Process a single block by hash')
  .argument('<hash>', 'Block hash to process')
  .action(async (hash) => {
    const wsUrl = program.opts().wsUrl || process.env.BLOCKBOOK_WS_URL;
    const httpUrl = program.opts().httpUrl || process.env.BLOCKBOOK_HTTP_URL;
    const apiKey = program.opts().apiKey || process.env.BLOCKBOOK_API_KEY;

    if (!wsUrl || !httpUrl || !apiKey) {
      console.error('Missing required configuration');
      process.exit(1);
    }

    try {
      const client = new BlockbookClient({ wsUrl, httpUrl, apiKey });

      client.on('blockTxids', ({ block, txids }) => {
        console.log('Block transactions:', {
          hash: block.hash,
          height: block.height,
          txCount: txids.length,
          txids
        });
      });

      client.on('error', (error) => {
        console.error('Error processing block:', error);
        process.exit(1);
      });

      await client.processBlock({ hash, height: 0 }); // Height not needed for manual processing
      process.exit(0);
    } catch (error) {
      console.error('Failed to process block:', error);
      process.exit(1);
    }
  });

// Original watch command logic
program
  .command('watch', { isDefault: true })
  .description('Watch for new blocks')
  .action(async () => {
    const wsUrl = program.opts().wsUrl || process.env.BLOCKBOOK_WS_URL;
    const httpUrl = program.opts().httpUrl || process.env.BLOCKBOOK_HTTP_URL;
    const apiKey = program.opts().apiKey || process.env.BLOCKBOOK_API_KEY;

    if (!wsUrl || !httpUrl || !apiKey) {
      console.error('Missing required configuration');
      process.exit(1);
    }

    console.log('Starting Blockbook listener...', { wsUrl, httpUrl });

    try {
      const client = new BlockbookClient({ wsUrl, httpUrl, apiKey });

      client.on('connected', () => console.log('Connected to Blockbook'));
      client.on('disconnected', () => console.log('Disconnected from Blockbook'));
      client.on('block', (block) => console.log('New block:', block));
      client.on('blockTxids', ({ block, txids }) => {

        console.log('Block transactions:', {
          hash: block.hash,
          height: block.height,
          txCount: txids.length
        });
      });
      client.on('error', console.error);

      await client.connect();

      // Handle graceful shutdown
      process.on('SIGINT', async () => {
        console.log('Shutting down...');
        await client.disconnect();
        process.exit(0);
      });

      process.on('SIGTERM', async () => {
        console.log('Shutting down...');
        await client.disconnect();
        process.exit(0);
      });

      // Keep process running
      process.stdin.resume();

    } catch (error) {
      console.error('Failed to start:', error);
      process.exit(1);
    }
  });

program.parse(); 