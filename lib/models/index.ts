import * as Sequelize from 'sequelize';
import * as sequelize from '../database';

var Account = require('./account');
var AccessToken = require('./access_token');
var Address = require('./address');
var Ambassador = require('./ambassador')(sequelize, Sequelize);
var AmbassadorClaim = require('./ambassador_claim')(sequelize, Sequelize);
var AmbassadorTeam = require('./ambassador_team')(sequelize, Sequelize);
var AmbassadorTeamMember = require('./ambassador_team_member')(sequelize, Sequelize);
var Coin = require('./coin')(sequelize, Sequelize);
var CashbackMerchant = require('./cashback_merchant');
var CashbackMerchantPayment = require('./cashback_merchant_payment');
var CashbackCustomerPayment = require('./cashback_customer_payment');
var MerchantBountyReward = require('./merchant_bounty_reward');
var Invoice = require('./invoice');
var PaymentForward = require('./payment_forward');
var PaymentForwardInputPayment = require('./payment_forward_input_payment');
var PaymentForwardOutputPayment = require('./payment_forward_output_payment');
var PayrollAccount = require('./payroll_account');
var PayrollInvoice = require('./payroll_invoice');
var PayrollPayment = require('./payrollpayment');
var AmbassadorTeamJoinRequest = require('./ambassador_team_join_request')(sequelize, Sequelize);
var DashInstantsendTransaction = require('./dash_instantsend_transaction')(sequelize, Sequelize);
var Price = require('./price')(sequelize, Sequelize);
var BankAccount = require('./bank_account')(sequelize, Sequelize);
var BlockcypherPaymentForward = require('./blockcypher_payment_forward')(sequelize, Sequelize);
var MerchantGroup = require('./merchant_group')(sequelize, Sequelize);
var MerchantGroupMember = require('./merchant_group_member')(sequelize, Sequelize);
var BlockcypherEvent = require('./blockcypher_event')(sequelize, Sequelize);
var BlockcypherHook = require('./blockcypher_hook')(sequelize, Sequelize);
var BlockcypherAddressForward = require('./blockcypher_address_forward')(sequelize, Sequelize);
var BlockcypherAddressForwardCallback = require('./blockcypher_address_forward_callback')(sequelize, Sequelize);
var TipJar = require('./tipjar')(sequelize, Sequelize);
var AddressRoute = require('./address_route')(sequelize, Sequelize);
var AccountRoute = require('./account_route')(sequelize, Sequelize);
var CoinOracle = require('./coin_oracle')(sequelize, Sequelize);
var SimpleWallet = require('./simple_wallet')(sequelize, Sequelize);

export {
  Account,
  AccessToken,
  Address,
  Ambassador,
  AmbassadorClaim,
  AmbassadorTeam,
  AmbassadorTeamMember,
  Coin,
  CashbackMerchant,
  CashbackMerchantPayment,
  CashbackCustomerPayment,
  Invoice,
  PaymentForward,
  PaymentForwardInputPayment,
  PaymentForwardOutputPayment,
  PayrollAccount,
  PayrollInvoice,
  PayrollPayment,
  MerchantBountyReward,
  AmbassadorTeamJoinRequest,
  DashInstantsendTransaction,
  Price,
  BankAccount,
  BlockcypherPaymentForward,
  MerchantGroup,
  MerchantGroupMember,
  BlockcypherEvent,
  BlockcypherHook,
  BlockcypherAddressForward,
  BlockcypherAddressForwardCallback,
  AddressRoute,
  AccountRoute,
  TipJar,
  CoinOracle,
  SimpleWallet
};

