import {ConfigureOracles} from './oracles'
var Account = require('./models/account');

import * as models from './models';

import {configureOracles} from '../config/oracles';
import * as accounts from './accounts';

import * as settings from './settings';

var oracles = ConfigureOracles(configureOracles);

export {
  oracles,
  models,
  accounts,
  settings
}

