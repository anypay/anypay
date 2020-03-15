import { getChannel } from 'rabbi';

export async function list(req, h) {

  return coins.getCoins();

}

export async function activate(req, h) {

  if (!req.payload.code) {
    throw new Error('code must be provided');
  }

  await coins.activateCoin(req.payload.code);

  await channel.publish('anypay.events', 'activatecoin', req.payload.coin);

  return true;

}

export async function deactivate(req, h) {

  if (!req.payload.code) {
    throw new Error('code must be provided');
  }

  await coins.deactivateCoin(req.payload.code);

  await channel.publish('anypay.events', 'deactivatecoin', req.payload.coin);

  return true;

}

