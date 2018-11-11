import {ConfigureOracles} from './oracles'
var Account = require('./models/account');

import {configureOracles} from '../config/oracles';

import * as accounts from './accounts';
import * as forwards from './forwards';
import * as settings from './settings';
import * as prices from './prices';
import * as models from './models';
import * as cashback from './cashback';
import * as ambassadors from './ambassadors';
import { log } from './logger';

var oracles = ConfigureOracles(configureOracles);

export {
  oracles,
  cashback,
  models,
  accounts,
  settings,
  prices,
  forwards,
  ambassadors,
  log
}

