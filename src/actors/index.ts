import { Actor } from "rabbi"

import { start as startFees } from '../../actors/detect_fees/actor'

import { start as refunds } from '../../actors/refunds/actor'

export class ActorSystem {

    actors: Actor[] = []
  
    addActor(actor: Actor) {
      this.actors.push(actor)
    }
  
    start() {
      for (let actor of this.actors) {
        actor.start()
      }
    }
  
    stop() {
      for (let actor of this.actors) {
        actor.stop()
      }
    }
}

export async function main() {

    const system = new ActorSystem()

    system.addActor(await startFees())

    system.addActor(await refunds())

    system.start()

}
