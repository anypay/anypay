
import { join } from 'path';

export function startActors(actorNames: string[]) {

  actorNames.map((actorName: string) => {

    return require(join(process.cwd(), 'actors', actorName, 'actor.ts'));

  })
  .forEach((actor: any) => actor.start());

}
