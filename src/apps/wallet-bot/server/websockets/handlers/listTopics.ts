import { Request } from '../router/router';

import { topics } from '../subscriptions';

export default async function({ session }: Request) {

    session.sendMessage('subscriptionTopics', { topics });

}