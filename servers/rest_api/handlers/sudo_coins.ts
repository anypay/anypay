import { coins } from '../../../lib';

export async function list(req, h) {

  return coins.getCoins();

}

export async function activate(req, h) {

  if (!req.payload.code) {
    throw new Error('code must be provided');
  }

  await coins.activateCoin(req.payload.code);

  return true;

}

export async function deactivate(req, h) {

  if (!req.payload.code) {
    throw new Error('code must be provided');
  }

  await coins.deactivateCoin(req.payload.code);

  return true;

}

