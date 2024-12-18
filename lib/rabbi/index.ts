
import { join } from 'path';

export function startActors(actorNames) {

  actorNames.map(actorName => {

    return require(join(process.cwd(), 'actors', actorName, 'actor.ts'));

  })
  .forEach(actor => actor.start());

}
