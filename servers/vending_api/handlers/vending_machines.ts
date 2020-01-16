
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

