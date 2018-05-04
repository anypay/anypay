import {BitcoinCashForwarder} from '../lib/oracles/bitcoincash_forwarder';
import {BitcoinBlockcypherForwarder} from '../lib/oracles/bitcoin_blockcypher_forwarder';
import {DashBlockcypherForwarder} from '../lib/oracles/dash_blockcypher_forwarder';
import {LitecoinBlockcypherForwarder} from '../lib/oracles/litecoin_blockcypher_forwarder';
import {DogecoinBlockcypherForwarder} from '../lib/oracles/dogecoin_blockcypher_forwarder';
import {EthereumBlockcypherDirect} from '../lib/oracles/ethereum_blockcypher_forwarder';
import {RippleDirect} from '../lib/oracles/ripple_direct';
import {ZcashDirect} from '../lib/oracles/zcash_direct';
import {Oracles} from '../lib/oracles';

export function configureOracles(oracles: Oracles) {

  oracles.registerOracle(new BitcoinCashForwarder());

  oracles.registerOracle(new RippleDirect());
  oracles.registerOracle(new ZcashDirect());

  oracles.registerOracle(new DashBlockcypherForwarder());
  oracles.registerOracle(new BitcoinBlockcypherForwarder());
  oracles.registerOracle(new LitecoinBlockcypherForwarder());
  oracles.registerOracle(new DogecoinBlockcypherForwarder());

  oracles.registerOracle(new EthereumBlockcypherDirect());
};


