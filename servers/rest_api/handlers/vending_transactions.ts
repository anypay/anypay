import {models} from '../../../lib';


export async function getAccountTransactions(request, h) {

  let accountId = request.auth.credentials.accessToken.account_id;

  console.log(accountId)

  let machine = await models.VendingMachine.findOne({where: { account_id: accountId }})
  console.log(machine.toJSON())

  if( machine ){

    let records = await models.VendingTransaction.findAll({
      where : { 'terminal_id' : machine.serial_number},
      order: [ [ 'terminal_time', 'DESC' ]]      
    });

    return records

  }

  return 'No Vending Machine Associated With Account';

}

export async function getLatestTransactions(request, h) {

  let records = await models.VendingTransaction.findAll({
    limit: 100,
    order: [ [ 'terminal_time', 'DESC' ]]       
  });

  return records

}
