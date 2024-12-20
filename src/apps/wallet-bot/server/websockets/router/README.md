# Websocket Router Class README

## Overview

The `Router` class is a dynamic routing system designed for WebSocket applications. It allows for the registration and handling of message topics received over WebSocket connections. Each message is associated with a specific topic and handled by a corresponding handler function. The router supports dynamic loading of handlers from a specified directory, making it easier to organize and manage the handling logic for different types of WebSocket messages.

## Features

- **Dynamic Handler Registration**: Automatically loads handler functions from a specified directory at runtime.
- **Schema Validation**: Optionally integrates with `@hapi/joi` for payload validation against defined schemas before handling a message.
- **Flexible Request Handling**: Handlers can process incoming WebSocket messages and perform actions based on the message content and the sender's session.

## Installation

Ensure you have a Node.js environment set up. This class requires Node.js for its filesystem operations and dynamic imports.

1. Clone or download your project repository.
2. Navigate to your project directory in a terminal.
3. Run `npm install` or `yarn` to install dependencies, including `@hapi/joi` for schema validation (if you plan to use it).

## Usage

### Defining Handlers

Handlers should be defined as modules in the specified `handlersDirectory`, with each handler exporting a default function that takes a `Request` object as its argument. Optionally, a `schema` can be exported for payload validation.

**Example Handler (`./handlers/subscribe.ts`):**

```typescript
import { Handler, Request } from '../path/to/Router';
import Joi from '@hapi/joi';

const subscribeHandler: Handler<void> = async (request: Request) => {
    const { session, message } = request;
    // Handle subscription logic here
};

// Define payload validation schema
subscribeHandler.schema = Joi.object({
    topics: Joi.array().items(Joi.string()).required(),
});

export default subscribeHandler;
```

### Setting Up the Router

```typescript
import Router from './path/to/Router';
import { join } from 'path';

// Initialize the router with the path to the handlers directory
const router = new Router({
    handlersDirectory: join(__dirname, 'handlers')
});

// Now, the router is ready to dispatch messages to the appropriate handlers based on their topic.
```

### Dispatching Messages

The `dispatch` method is used to route messages to their respective handlers based on the message's topic. The method requires a `session` (an instance of `WebsocketClientSession`) and a `message` (an object with `topic` and `payload` properties).

**Example Usage:**

```typescript
import WebsocketClientSession from './session';

// Example WebSocket message
const message = {
    topic: "subscribe",
    payload: {
        topics: ["priceUpdated"]
    }
};

// Example session object
const session = new WebsocketClientSession();

// Dispatch the message
router.dispatch(session, message);
```

## API Reference

### `registerHandler(name: string, handler: Handler<void>): void`

Registers a handler for a specific topic.

### `getHandler(name: string): Handler<void> | undefined`

Retrieves a registered handler by its name.

### `dispatch(session: WebsocketClientSession, message: WebsocketMessage): void`

Routes a message to its corresponding handler based on the message's topic. Validates the payload against the handler's schema if one is defined.

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

Specify your project's license here.

---

This README provides a basic guide to using the `Router` class in a WebSocket application. Adjust the paths and examples according to your project's structure and requirements.