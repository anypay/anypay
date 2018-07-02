import {ConfigureOracles} from './oracles'
var Account = require('./models/account');

import {configureOracles} from '../config/oracles';
import * as accounts from './accounts';

var oracles = ConfigureOracles(configureOracles);

var models = {
  accounts: Account
}

export {
  oracles,
  models,
  accounts
}


