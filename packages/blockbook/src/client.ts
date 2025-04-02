import WebSocket from 'ws';
import axios from 'axios';
import { EventEmitter } from 'events';
import { 
  BlockbookMessage, 
  BlockNotification,
  SubscribeRequest,
  BlockbookBlockResponse,
  BlockbookConfig
} from './types';

export class BlockbookClient extends EventEmitter {
  private ws: WebSocket | null = null;
  private wsUrl: string;
  private apiKey: string;
  private httpUrl: string;

  constructor(config: BlockbookConfig) {
    super();
    this.wsUrl = config.wsUrl;
    this.apiKey = config.apiKey;
    this.httpUrl = config.httpUrl;
  }

  async connect(): Promise<void> {
    const url = `${this.wsUrl}/${this.apiKey}`;
    
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(url);

      this.ws.on('open', async () => {
        try {
          await this.subscribe();
          this.emit('connected');
          resolve();
        } catch (error) {
          reject(error);
        }
      });

      this.ws.on('message', async (data: string) => {
        try {
          console.log('DATA', data.toString());
          const message = JSON.parse(data) as BlockbookMessage;
          this.emit('raw_message', message);
          
          if (message.data) {
            await this.handleMessage(message);
          }
        } catch (error) {
          this.emit('error', error);
        }
      });

      this.ws.on('error', (error) => {
        this.emit('websocket_error', error);
        reject(error);
      });

      this.ws.on('close', () => {
        this.emit('disconnected');
        this.reconnect();
      });
    });
  }

  private async subscribe(): Promise<void> {
    if (!this.ws) throw new Error('WebSocket not connected');

    const request: SubscribeRequest = {
      id: '1',
      method: 'subscribeNewBlock',
      params: []
    };

    this.ws.send(JSON.stringify(request));
  }

  private async handleMessage(message: BlockbookMessage): Promise<void> {
    this.emit('message', message);
    if (!message.data?.hash) return;

    if (message.data.hash) {
      this.emit('block', { hash: message.data.hash, height: message.data.height });
      await this.processBlock({
        hash: message.data.hash,
        height: message.data.height
      });
    }
  }

  private async getBlockTxids(hash: string): Promise<string[]> {
    //const url = `${this.httpUrl}/${this.apiKey}/api/v2/block/${hash}`;
    const url = 'https://btcbook.nownodes.io/d30afa50-d891-43cd-b27c-c9fca7ed5b7b/api/v2/block/000000000000000000000a8a35d8f999099f5d7a3acc0b76dc04c27de6489583'
    const response = await axios.get<BlockbookBlockResponse>(url);

    console.log('BLOCK RESPONSE', response.data)
    
    return response.data.txs.map(tx => tx.txid);
  }

  public async processBlock(block: BlockNotification): Promise<void> {
    try {
      const txids = await this.getBlockTxids(block.hash);
      this.emit('blockTxids', { block, txids });
    } catch (error) {
      this.emit('error', error);
    }
  }

  private async reconnect(): Promise<void> {
    this.emit('reconnecting');
    setTimeout(async () => {
      try {
        await this.connect();
      } catch (error) {
        this.emit('reconnection_failed', error);
        await this.reconnect();
      }
    }, 5000);
  }

  async disconnect(): Promise<void> {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.emit('disconnected');
    }
  }
} 