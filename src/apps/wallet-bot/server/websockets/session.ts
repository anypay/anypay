
import { WebSocket } from 'ws'
import { Channel } from 'amqplib'
import log from '../../log'
import { v4 as uuid } from 'uuid';
import router from './router/router'
import { exchange } from '../../amqp';
import { AuthTokenDataTypes } from '../../jwt';

export default class WebsocketClientSession {
 
    private readonly channel: Channel
    readonly ws: WebSocket
    readonly uid: string
    readonly token: AuthTokenDataTypes | undefined

    constructor(ws: WebSocket, channel: Channel, token?: AuthTokenDataTypes) {
        this.token = token;
        this.uid = uuid();
        this.ws = ws;
        this.channel = channel;
        ws.on('message', this.onMessage.bind(this));
        ws.on('close', this.onClose.bind(this));
        this.onOpen();
    }

    private onMessage(message: string) {
        try {
            const { topic, payload } = JSON.parse(message.toString());

            this.onJsonReceived(topic, payload);

        } catch (error) {
            console.error('Failed to parse json message', error);
            this.closeSession(new Error('failed to parse json message'));
        }

    }

    private onJsonReceived(topic: string, payload: any) {

        router.dispatch(this, { topic, payload });

    }

    private async onOpen() {
        // authenticate the websocket client by parsing the authorization header Bearer token
        // and validating it with jwt.verifyToken()
        // if the token is invalid, close the websocket connection  

        try {
            this.ws.send(JSON.stringify({
                topic: 'websocket.connected',
                payload: {
                    uid: this.uid
                }
            
            }))
            await this.channel.assertQueue(`websocket:${this.uid}`, { durable: false, autoDelete: true });
            await this.channel.consume(`websocket:${this.uid}`, (msg) => {
                if (msg !== null) {
                    console.log(`Received message from queue ${this.uid}: ${msg.content.toString()}`);
                    console.log(msg.content.toString());
                    this.ws.send(msg.content.toString());
                    this.channel?.ack(msg);
                }
            });
        } catch (error) {
            console.error('Failed to create or consume from RabbitMQ channel', error);
        }
    }

    async bindWebsocketToTopic(topic: string) {
        await this.channel.bindQueue(`websocket:${this.uid}`, exchange, topic);
    }

    private onClose() {
            log.info(`websocket.client.disconnected`, { uid: this.uid });
            if (this.channel) {
                this.channel.deleteQueue(`websocket:${this.uid}`); //TODO: Is this call deleteQueue redundant or truly necessary?
                this.channel.close().then(() => {
                    console.log(`Channel for UID ${this.uid} closed`);
                }).catch(error => {
                    console.error(`Failed to close channel for UID ${this.uid}`, error);
                });
            }
    }

    async closeSession(error?: Error) {
        if (error) {
            this.ws.send(JSON.stringify({ topic: 'error', payload: error.message }));
        }
        this.ws.close();
    }

    async sendMessage(topic: string, payload: any) {
        this.ws.send(JSON.stringify({ topic, payload }));
    }

}