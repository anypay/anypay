
import config from '../config'

import * as rabbi from 'rabbi'

const dirname = `${__dirname}/../actors`

import { log } from '../log'

var tsModules: any = require('require-all')({
  dirname,
  filter      :  /(.+)\.ts$/,
});

var jsModules: any = require('require-all')({
  dirname,
  filter      :  /(.+)\.js$/,
});

var modules: any = Object.assign(tsModules, jsModules)

interface ActorParams {
  name: string;
  queue: string;
  routingkey: string;
  exchange: string;
  start: Function;
}

class Actor {
  name: string;
  queue: string;
  routingkey: string;
  exchange: string;
  start: Function;

  constructor(params: ActorParams) {
    this.name = params.name
    this.queue = params.queue
    this.routingkey = params.routingkey
    this.exchange = params.exchange
    this.start = params.start
  }

  toJSON() {
    return {
      name: this.name,
      queue: this.queue,
      routingkey: this.routingkey,
      exchange: this.exchange
    }
  }
}

export async function start(): Promise<Actor[]> {

  log.info('rabbi.actors.start')

  const actors = Object.keys(modules).map(name => {

    return new Actor({
      name: modules[name],
      queue: modules[name].queue || name,
      routingkey: modules[name].routingkey  || name,
      exchange: modules[name].exchange || config.get("amqp_exchange"),
      start: modules[name].start || modules[name].default
    })

  })

  for (let actor of actors) {

    log.info('rabbi.actor.start', actor.toJSON())

    rabbi.Actor.create({
      exchange: actor.exchange,
      routingkey: actor.routingkey,
      queue: actor.queue,
      connection: rabbi.connection,
      channel: rabbi.channel
    })
    .start(actor.start)

  }

  return actors

}
