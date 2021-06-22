
import { models, log } from '../../../lib';

export async function index(req, h) {

  return models.SimpleWallet.findAll();

}
