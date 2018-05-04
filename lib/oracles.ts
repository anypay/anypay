import * as log from 'winston';
import {EventEmitter} from 'events';
import {Oracle} from '../types/interfaces';

export class Oracles {
  oracles: object;
  events: EventEmitter;

  constructor() {
    this.oracles = {};
    this.events = new EventEmitter();
  }

  registerOracle(oracle: Oracle) {

    if (this.oracles[oracle.name]) {
      log.info('oracle already registered', oracle.name);
      return oracle;
    } else {

      this.oracles[oracle.name] = oracle;
      log.info('oracle registered', oracle.name);
      this.events.emit('oracle:registered', oracle.name)
      return oracle;
    }
  }
  deregisterOracle(name: string) {
    if (this.oracles[name]) {
      delete this.oracles[name];
      log.info('oracle deregistered', name);
      this.events.emit('oracle:deregistered', name);
      return true;
    } else {
      log.info('no oracle to deregister', name);
      return false;
    }
  }

  getOracle(name: string): Oracle {
    var oracle = this.oracles[name];

    if (oracle) {
      log.info('oracle found', name);
      return oracle;
    } else {
      log.info('oracle not found', name);
      throw new Error('oracle not found');
    }
  }

};

export function ConfigureOracles(configure: (o: Oracles) => void): Oracles {
  
  var oracles = new Oracles();

  configure(oracles);

  return oracles;
};

