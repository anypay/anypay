
import { join } from 'path';

export function startActors(actorNames) {

  actorNames.map(actorName => {

    return require(join(process.cwd(), 'actors', actorName, 'actor.ts'));

  })
  .forEach(actor => actor.start());

}

export function publishJson(channel, exchange, routingkey, json) {
  return channel.publish(exchange, routingkey, Buffer.from(
    JSON.stringify(json) 
  ))
}

