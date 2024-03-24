#
#    This file is part of anypay: https://github.com/anypay/anypay
#    Copyright (c) 2017 Anypay Inc, Steven Zeiler
#
#    Permission to use, copy, modify, and/or distribute this software for any
#    purpose  with  or without fee is hereby granted, provided that the above
#    copyright notice and this permission notice appear in all copies.
#
#    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
#    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
#    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
#    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
#    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
#    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
#    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
#//==============================================================================
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
    "SUDO_API_KEY=#{data_bag_item('anypay', 'api')['SUDO_API_KEY']}",
    "REQUIRED_FEE_RATE_BTC=3",
    "REQUIRED_FEE_RATE_DOGE=500000",
    "BLOCKCYPHER_TOKEN=#{data_bag_item('anypay', 'api')['BLOCKCYPHER_TOKEN']}",
    "BLOCKCYPHER_WEBHOOK_TOKEN=#{data_bag_item('anypay', 'api')['BLOCKCYPHER_WEBHOOK_TOKEN']}",
    "FEATURE_SINGLE_OUTPUTS_ONLY=#{data_bag_item('anypay', 'api')['FEATURE_SINGLE_OUTPUTS_ONLY']}",
    "WEBSOCKETS_SERVER=1",
    "KRAKEN_PLUGIN=0",
    "XMR_RPC_URL=#{data_bag_item('anypay', 'xmr')['XMR_RPC_URL']}",
    "XMR_RPC_USER=#{data_bag_item('anypay', 'xmr')['XMR_RPC_USER']}",
    "XMR_RPC_PASSWORD=#{data_bag_item('anypay', 'xmr')['XMR_RPC_PASSWORD']}",
    "XRP_SIMPLE_WALLET_SEED=#{data_bag_item('anypay', 'xrp')['XRP_SIMPLE_WALLET_SEED']}",
    "TAAL_API_KEY=#{data_bag_item('anypay', 'api')['TAAL_API_KEY']}",
    "ROCKETCHAT_WEBHOOK_URL=#{data_bag_item('anypay', 'api')['ROCKETCHAT_WEBHOOK_URL']}",
    "LOKI_ENABLED=true",
    "LOKI_HOST=http://3.84.14.162:3100",
    "LOKI_LABEL_APP=anypay",
    "BOOSTPOW_WALLET_BOT_CONTENT_TXID=60d47f7c7295889af423385922324764144f7fa7eb003f69ef733b3bb32d6fcc",
    "INTERVAL_WALLET_BOT_XMR_ADDRESS=#{data_bag_item('anypay', 'wallet-bot')['xmr_address']}",
    "INTERVAL_WALLET_BOT_ACCESS_TOKEN=#{data_bag_item('anypay', 'wallet-bot')['access_token']}",
    "API_BASE=https://api.anypayx.com",
    "NOWNODES_API_KEY=#{data_bag_item('anypay', 'api')['NOWNODES_API_KEY']}",
    "NOWNODES_ENABLED=#{data_bag_item('anypay', 'api')['NOWNODES_ENABLED']}",
    "CHAIN_SO_BROADCAST_PROVIDER_ENABLED=#{data_bag_item('anypay', 'api')['CHAIN_SO_BROADCAST_PROVIDER_ENABLED']}",
    "BLOCKCHAIR_BROADCAST_PROVIDER_BTC_ENABLED=#{data_bag_item('anypay', 'api')['BLOCKCHAIR_BROADCAST_PROVIDER_BTC_ENABLED']}",
    "MONERO_WALLET_RPC_URL=http://184.73.109.23:28089/json_rpc",
    "REQUIRE_BTC_CONFIRMATIONS=false",
    "BITCOIND_RPC_HOST=http://52.3.113.228:8332",
    "BITCOIND_RPC_USERNAME=anypay",
    "BITCOIND_RPC_PASSWORD=liberty"
  ]
  command 'ts-node main.ts'
end

