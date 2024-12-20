

import { startServer } from "./server/websockets/server"

export async function main() {

    // Build the WebSocket server
    const server = await startServer();

    console.log("walletbot.server.websockets.started", { ...server.options });

}

if (require.main === module) {

    main()

}
