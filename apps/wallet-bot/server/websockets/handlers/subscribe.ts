import * as Joi from '@hapi/joi'
import { Request } from '../router/router';

export const schema = Joi.object({
    topics: Joi.array().items(Joi.string()).required(),
}).required()

import { topics as allowedTopics } from '../subscriptions';

export default async function({ message, session }: Request) {

    console.log("MESSAGE", message)

    const { payload: { topics } } = message;

    for (const topic of topics) {

        if (!allowedTopics.includes(topic)) {
            throw new Error(`Topic ${topic} is not allowed`);
        }

        session.bindWebsocketToTopic(topic)

    }

    session.sendMessage('subscribed', { topics })

}