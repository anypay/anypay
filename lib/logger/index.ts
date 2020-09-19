
import * as winston from 'winston';

const log = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console()
  ]
});

export {

  log

}
