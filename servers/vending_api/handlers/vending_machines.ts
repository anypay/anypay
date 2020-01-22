import { Request, ResponseToolkit } from 'hapi';

import * as Boom from 'boom';

import { models } from '../../../lib';

export async function index(req: Request, h: ResponseToolkit) {

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

export async function update(req: Request, h: ResponseToolkit) {

  let vendingMachine = await models.VendingMachine.findOne({ where: {

    id: req.params.id

  }});

  if (!vendingMachine) return h.response('Vending Machine Not Found').code(404);

  let account = await models.Account.findOne({where:{email: req.payload.email}});

  if(!account) return h.response("Invalid Email").code(404);

  vendingMachine.account_id = account.id;

  vendingMachine.current_location_address = account.physical_address,

  vendingMachine.current_location_name =  account.business_name

  await vendingMachine.save();

  return { vendingMachine }

}



export async function show(req, h){

  try{

    let vending_machine = await models.VendingMachine.findOne({where:{ id:req.params.id}})

    if (!vending_machine) return h.response('Vending Machine Not Found').code(404);

    return {vending_machine}

  }catch(error){

    return Boom.badRequest(error.message);

  }
}

export async function toggleStrategy(req,h){

  let vendingMachine = await models.VendingMachine.findOne({where:{ id:req.params.id}})

  try{


    if(!vendingMachine.additional_output_strategy_id){

      vendingMachine.additional_output_strategy_id = 1; 

      await vendingMachine.save();

    }else{

      vendingMachine.additional_output_strategy_id = 0; 

      await vendingMachine.save();

    }

    return {vendingMachine}

  }catch(error){

    return Boom.badRequest(error.message);

  }

}

