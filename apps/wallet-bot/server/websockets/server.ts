import * as WebSocket from 'ws';
import { connect, Connection } from 'amqplib';
import log from '../../log';
import WebsocketClientSession from './session';
import { Server } from 'http'
import * as Hapi from '@hapi/hapi';
import { AuthTokenDataTypes, verifyToken } from '../../jwt';

const RABBITMQ_URL = 'amqp://localhost'; // RabbitMQ connection URL

export async function buildServer({ listener }: { listener: Server }): Promise<WebSocket.Server> {
    const wsServer = new WebSocket.Server({
        server: listener
    });

    let rabbitConnection: Connection;
    try {
        rabbitConnection = await connect(process.env.AMQP_URL || RABBITMQ_URL);
    } catch (error) {
        console.error('Failed to connect to RabbitMQ', error);
        process.exit(1);
    }

    const channel = await rabbitConnection.createChannel();

    await channel.assertExchange('anypay.wallet-bot', 'direct', { durable: true });

    wsServer.on('connection', async (ws: WebSocket, request: any) => {

        var authToken: AuthTokenDataTypes | undefined;

        if (request.headers.authorization) {

            const encodedToken = request.headers.authorization.split(' ')[1];

            if (encodedToken) {

                try {
                    authToken = await verifyToken(encodedToken);
                    console.log('websocket.auth.token.verified', authToken);
                } catch(error) {
                    ws.close();
                    return;
                }
            }

            
        }

        const channel = await rabbitConnection.createChannel();

        const session = new WebsocketClientSession(ws, channel, authToken);

        log.info('websocket.client.connected', { uid: session.uid });

    });

    return wsServer;
};

export async function startServer(): Promise<WebSocket.Server> {

    const server = Hapi.server({
        port: process.env.WALLETBOT_WEBSOCKETS_PORT || 3000,
        host: process.env.WALLETBOT_WEBSOCKETS_HOST || '0.0.0.0'
    });

    const wsServer = await buildServer({ listener: server.listener });

    server.start()

    console.log(server)

    return wsServer;
}


