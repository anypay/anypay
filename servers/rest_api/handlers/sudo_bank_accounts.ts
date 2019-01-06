
import { models, log } from '../../../lib';

export async function index(request, h) {

  return models.BankAccount.findAll();

}

