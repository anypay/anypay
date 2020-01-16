
import * as Boom from 'boom';

import { models } from '../../../lib';

export async function index(req, h) {

  try {

    let records = await  models.VendingMachine.findAll();

    let vending_machines = []

    await Promise.all( records.map( async(record)=>{
   
      let account = await models.Account.findOne({where:{id:record.account_id}});

      let tmp = record.toJSON();

      if(account){
        tmp['email'] = account.email;
      }

      vending_machines.push(tmp)

    }))

    return { vending_machines }

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

export async function update(req, h) {

  let vendingMachine = await models.VendingMachine.findOne({ where: {

    id: req.params.id

  }});

  if (!vendingMachine) {

    return {

      success: false,

      error: 'vendingMachine not found'

    }

  }

  let account = await models.Account.findOne({where:{email: req.payload.email}});

  if(!account) return Boom.badRequest('invalid email')

  vendingMachine = await models.VendingMachine.update(
          {
            account_id: account.id,
            current_location_address: account.physical_address,
            current_location_name: account.business_name
          }, {

    where: { id: req.params.id }

  });

  return {

    success: true,

    vendingMachine

  }

}



export async function show(req, h){

  try{

    let vending_machine = await models.VendingMachine.findOne({where:{ id:req.params.id}})

    return {vending_machine}

  }catch(error){

    return Boom.badRequest(error.message);

  }
}

export async function toggleStrategy(req,h){

  let machine = await models.VendingMachine.findOne({where:{ id:req.params.id}})

  try{


    if(!machine.additional_output_strategy_id){

      machine.additional_output_strategy_id = 1; 

      return await machine.save();

    }else{

      machine.additional_output_strategy_id = 0; 

      return await machine.save();

    }
  }catch(error){

    return Boom.badRequest(error.message);

  }

}

