# @anypay/blockbook

A Node.js client for Blockbook's WebSocket and HTTP APIs. This package provides real-time block notifications and transaction lookups from Blockbook instances.

## Installation

```bash
npm install @anypay/blockbook
```

## Usage

### As a library

```typescript
import { BlockbookClient } from '@anypay/blockbook';

const client = new BlockbookClient({
  wsUrl: 'wss://btcbook.nownodes.io/wss',
  httpUrl: 'https://btcbook.nownodes.io/api', 
  apiKey: 'your-api-key'
});

// Listen for events
client.on('connected', () => console.log('Connected to Blockbook'));
client.on('disconnected', () => console.log('Disconnected from Blockbook'));

// New block notifications
client.on('block', (block) => {
  console.log('New block:', {
    hash: block.hash,
    height: block.height
  });
});

// Block with transaction IDs
client.on('blockTxids', ({ block, txids }) => {
  console.log('Block transactions:', {
    hash: block.hash,
    height: block.height,
    txCount: txids.length,
    txids
  });
});

// Handle errors
client.on('error', console.error);

// Connect to Blockbook
await client.connect();

// Graceful shutdown
await client.disconnect();
```

### As a CLI tool

```bash
# Using environment variables
export BLOCKBOOK_WS_URL=wss://btcbook.nownodes.io/wss
export BLOCKBOOK_HTTP_URL=https://btcbook.nownodes.io/api
export BLOCKBOOK_API_KEY=your-api-key

# Watch for new blocks
npx @anypay/blockbook watch

# Process a specific block
npx @anypay/blockbook process-block <block-hash>

# Or using command line arguments
npx @anypay/blockbook \
  --ws-url=wss://btcbook.nownodes.io/wss \
  --http-url=https://btcbook.nownodes.io/api \
  --api-key=your-api-key
```

## Events

The BlockbookClient emits the following events:

- `connected`: When successfully connected to Blockbook
- `disconnected`: When disconnected from Blockbook
- `reconnecting`: When attempting to reconnect
- `block`: When a new block is detected (includes block hash and height)
- `blockTxids`: When block transactions are fetched (includes block info and txids)
- `error`: When an error occurs
- `raw_message`: Raw messages from the WebSocket connection
- `websocket_error`: WebSocket-specific errors
- `reconnection_failed`: When a reconnection attempt fails

## Configuration

The client requires three configuration parameters:

- `wsUrl`: WebSocket URL for the Blockbook instance
- `httpUrl`: HTTP URL for the Blockbook API
- `apiKey`: API key for authentication

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Run tests
npm test

# Start in development mode
npm run dev
```

## License

ISC

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
