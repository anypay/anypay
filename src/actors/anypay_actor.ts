import { Actor } from "rabbi"
import { Message, Channel } from 'amqplib'

interface Context<T> {
    message: Message,
    channel: Channel,
    json: T;
}

interface Handler<T> {
    (ctx: Context<T>): Promise<void>
}

interface SomeEvent {
    type: string;
    payload: any;
    account_id?: number;
    app_id?: number;

}

class AnypayActor<T> extends Actor {

    handler: Handler<T>;

    constructor({ queue, routingkey, exchange, handler }: { queue: string, routingkey: string, exchange: string, handler: Handler<T> }) {
        super({ queue, routingkey, exchange })
        this.handler = handler
    }

    async start() {

        return super.start(async (channel: Channel, msg: Message, json: T) => {

            await this.handler({ channel, message: msg, json })

        })
    }
}

export function createActor<T>(config: {
    queue: string;
    routingkey: string;
    exchange: string;
    handler: Handler<T>;
}): AnypayActor<T> {
    return new AnypayActor<T>(config)
}

/*
const actor = createActor<SomeEvent>({
    queue: 'detect_fees',
    routingkey: 'detect_fees',
    exchange: 'anypay',
    handler: async (ctx: Context<SomeEvent>) => {

        // do something with ctx.json
    }
})
*/