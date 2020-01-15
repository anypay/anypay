
import * as Boom from 'boom';

import { models } from '../../../lib';

export async function index(req, h) {

  try {

    let vending_machines = await  models.VendingMachine.findAll();

    return { vending_machines }

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

export async function toggleStrategy(req,h){

  let machine = await models.VendingMachine.findOne({where:{ id:req.params.id}})

  try{


    if(!machine.additional_output_strategy_id){

      console.log(machine.toJSON())
      machine.additional_output_strategy_id = 1; 

      console.log(machine.toJSON())
      let res =  await machine.save();

      console.log(res.toJSON())

      return res
    }else{

      console.log(machine.toJSON())
      machine.additional_output_strategy_id = 0; 

      console.log(machine.toJSON())
      let res =  await machine.save();
      console.log(res.toJSON())

      return res

    }
  }catch(error){

    return Boom.badRequest(error.message);

  }

}

