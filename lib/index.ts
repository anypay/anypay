import {ConfigureOracles} from './oracles'
var Account = require('./models/account');

import {configureOracles} from '../config/oracles';
import * as accounts from './accounts';

import * as settings from './settings';

var oracles = ConfigureOracles(configureOracles);

var models = {
  accounts: Account
}

export {
  oracles,
  models,
  accounts,
  settings
}

