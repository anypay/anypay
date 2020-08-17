# Anypay Hot Wallet  

> bitcoind JSONRPC interface 

## What 
  - Anypay Hot Wallet implements the bitcoind interface using Electrum client for wallet management   
  - bitcoind is a program that implements the Bitcoin protocol for remote procedure calls (RPC) use. 
  - Every cryptocurrencies node software runs a version on bitcoind and is the easiest way to communicate with your full node

## How 
  - Anypay Hot Wallet serves a jsonrpc interface protected by a username and password
  - Anypay Hot Wallet uses the Electrum Wallet 
  - Electrum is a light weight wallet client with a JSONRPC interface 
  - A version of Electrum is required for each currency plugin for the wallet

## Why 
  - Abstracting the bitcoind interface allows custom logic to be programmed into methods, specifically 
    -  sendtoaddress
    -  sendtomany
    -  getaddress
    -  getbalance
  - This interface plugs into the General Bytes bitcoind hot wallet option

## Features 
 - Bitcoin Cash 
   - getbalance -> returns balance of hot wallet
   - getaddress -> returns hot wallet address
   - sendtoaddress -> sends output
   - sendtomany -> sends multi output tx

## Introduction 

Anypay Hot Wallet is made up of 3 components 

1. Hot Wallet JSON RPC Server
  - Common server that servers all hot wallet plugins 

2. Electrum Daemon/JSON RPC
  - Lightweight wallet software with JSONRPC interface exposed for the backend to communicate with 

3. Wallet Plugin 
  - Lib functions that implenments the bitcoind interface with any custom logic desired 
  - For example --> sendtoaddresss sends an output to destination, Anypay vending and the renter of the vending machine

## Config

`ANYPAY_HOT_WALLET_HOST
 ANYPAY_HOT_WALLET_PORT
 ANYPAY_HOT_WALLET_USER
 ANYPAY_HOT_WALLET_PASSWORD`

**For Each Plugin**

`PLUGIN_ELECTRUM_RPC_PORT
 PLUGIN_ELECTRUM_RPC_PASSWORD
 PLUGIN_ELECTRUM_RPC_USER
 PLUGIN_ELECTRUM_RPC_HOST
 PLUGIN_HOT_WALLET_USERNAME
 PLUGIN_HOT_WALLET_PASSWORD`

## Quick Start

#### Download Elecron Cash onto your server 
- https://github.com/Electron-Cash/Electron-Cash/releases/tag/4.0.12
- Create Electron Cash wallet on the server

#### Run Daemon & load wallet 

`bash> electron-cash
 bash> electron-cash daemon load_wallet -w PATH_TO_WALLET -wp WALLET_PASSWORD
 bash> electron-cash setconfig rpcport BCH_ELECTRUM_RPC_PORT
 bash> electron-cash setconfig rpcpass BCH_ELECTRUM_RPC_PASSWORD
 bash> electron-cash setconfig rpcuser BCH_ELECTRUM_RPC_USER`

**Run Anypay Wallet Server**


`docker run -d --env-file=.env --restart=always --name=anypay-hot-wallet-server anypay:latest ts-node servers/hot-wallet/server.ts`


## Use Cases 

`curl -X POST -d '{"id":0,"method":"sendtoaddress","params":[bitcoincash:qpppe9kujfssu7gaqc4w0yrcxvr0hm47sg72mdld2l, .000002]}' http://api.anypayinc.com/api/hot-wallet/bch`

 - returns txid 
