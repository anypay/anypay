#
# Cookbook:: anypay
# Recipe:: default
#
# Copyright:: 2018 - 2023, Anypay, All Rights Reserved.

include_recipe 'docker.anypayinc.com::registry'

docker_image 'anypay/anypay' do
  tag "master"
  action :pull
  notifies :redeploy, 'docker_container[api.anypayx.com]'
end

docker_container "anypay" do
  repo 'anypay/anypay'
  tag "master"
  port [
    "3401:8000",
    "5201:5201"
  ]
  restart_policy 'always'
  volumes [
    '/etc/anypayinc:/etc/anypayinc'
  ]
  env [
    "AMQP_URL=#{data_bag_item('anypay', 'api')['AMQP_URL']}",
    "DATABASE_URL=#{data_bag_item('anypay', 'api')['DATABASE_URL']}",
    "AWS_ACCESS_KEY_ID=#{data_bag_item('anypay', 'api')['AWS_ACCESS_KEY_ID']}",
    "AWS_SECRET_ACCESS_KEY=#{data_bag_item('anypay', 'api')['AWS_SECRET_ACCESS_KEY']}",
    "ANYPAY_FIXER_ACCESS_KEY=#{data_bag_item('anypay', 'api')['ANYPAY_FIXER_ACCESS_KEY']}",
    "HOST=0.0.0.0",
    "NODE_ENV=#{data_bag_item('anypay', 'api')['NODE_ENV']}",
    "STATSD_HOST=#{data_bag_item('anypay', 'api')['STATSD_HOST']}",
    "SUDO_PASSWORD_HASH=#{data_bag_item('anypay', 'api')['SUDO_PASSWORD_HASH']}",
    "UPTIMEROBOT_API_KEY=#{data_bag_item('anypay', 'api')['UPTIMEROBOT_API_KEY']}",
    "COINMARKETCAP_API_KEY=#{data_bag_item('anypay', 'api')['COINMARKETCAP_API_KEY']}",
    "MONITOR_BASE=#{data_bag_item('anypay', 'api')['MONITOR_BASE']}",
    "API_BASE=#{data_bag_item('anypay', 'api')['API_BASE']}",
    "JSON_PROTOCOL_IDENTITY_ADDRESS=#{data_bag_item('anypay', 'api')['JSON_PROTOCOL_IDENTITY_ADDRESS']}",
    "JSON_PROTOCOL_IDENTITY_WIF=#{data_bag_item('anypay', 'api')['JSON_PROTOCOL_IDENTITY_WIF']}",
    "API_BASE=https://api.anypayinc.com",
    "BIP_270_EXTRA_OUTPUT_ADDRESS=1Q9Z2y3Jhq6xbxD6AU34StgmUjfpbZgxqA",
    "BIP_270_DASH_EXTRA_OUTPUT_ADDRESS=XhdakBbwz1hxHkNQWjfzkjukZTFV2umkzP",
    "X509_DOMAIN_CERT_DER_PATH=#{data_bag_item('anypayinc', 'x509')['X509_DOMAIN_CERT_DER_PATH']}",
    "X509_ROOT_CERT_DER_PATH=#{data_bag_item('anypayinc', 'x509')['X509_ROOT_CERT_DER_PATH']}",
    "X509_PRIVATE_KEY_PATH=#{data_bag_item('anypayinc', 'x509')['X509_PRIVATE_KEY_PATH']}",
    "MONEYBUTTON_WEBHOOK_SECRET=#{data_bag_item('anypayinc', 'moneybutton')['webhook_secret']}",
    "SUDO_API_KEY=#{data_bag_item('anypay', 'api')['SUDO_API_KEY']}",
    "REQUIRED_FEE_RATE_BTC=3",
    "REQUIRED_FEE_RATE_DOGE=500000",
    "blockcypher_token=#{data_bag_item('anypay', 'api')['blockcypher_token']}",
    "blockcypher_webhook_secret=#{data_bag_item('anypay', 'api')['blockcypher_webhook_secret']}",
    "FEATURE_SINGLE_OUTPUTS_ONLY=#{data_bag_item('anypay', 'api')['FEATURE_SINGLE_OUTPUTS_ONLY']}",
    "WEBSOCKETS_SERVER=1",
    "KRAKEN_PLUGIN=0",
    "XMR_RPC_URL=#{data_bag_item('anypay', 'xmr')['XMR_RPC_URL']}",
    "XMR_RPC_USER=#{data_bag_item('anypay', 'xmr')['XMR_RPC_USER']}",
    "XMR_RPC_PASSWORD=#{data_bag_item('anypay', 'xmr')['XMR_RPC_PASSWORD']}",
    "XRP_SIMPLE_WALLET_SEED=#{data_bag_item('anypay', 'xrp')['XRP_SIMPLE_WALLET_SEED']}",
    "TAAL_API_KEY=#{data_bag_item('anypay', 'api')['TAAL_API_KEY']}",
    "rocketchat_webhook_url=#{data_bag_item('anypay', 'api')['rocketchat_webhook_url']}",
    "loki_enabled=true",
    "loki_host=http://3.84.14.162:3100",
    "loki_label_app=anypay",
    "rabbi_start_cron=true",
    "boostpow_wallet_bot_content_txid=60d47f7c7295889af423385922324764144f7fa7eb003f69ef733b3bb32d6fcc",
    "interval_wallet_bot_xmr_address=#{data_bag_item('anypay', 'wallet-bot')['xmr_address']}",
    "interval_wallet_bot_access_token=#{data_bag_item('anypay', 'wallet-bot')['access_token']}",
    "api_base=https://api.anypayx.com",
    "nownodes_api_key=#{data_bag_item('anypay', 'api')['nownodes_api_key']}",
    "nownodes_enabled=#{data_bag_item('anypay', 'api')['nownodes_enabled']}",
    "chain_so_broadcast_provider_enabled=#{data_bag_item('anypay', 'api')['chain_so_broadcast_provider_enabled']}",
    "blockchair_broadcast_provider_btc_enabled=#{data_bag_item('anypay', 'api')['blockchair_broadcast_provider_btc_enabled']}",
    "monero_wallet_rpc_url=http://184.73.109.23:28089/json_rpc",
    "require_btc_confirmations=false",
    "bitcoind_rpc_host=http://52.3.113.228:8332",
    "bitcoind_rpc_username=anypay",
    "bitcoind_rpc_password=liberty"
  ]
  command 'ts-node main.ts'
end

