
import { models, ach } from '../../../lib';

import * as Boom from 'boom';

export async function index(req, h) {

  try {

    let resp = await  models.AchBatch.findAll({

      order: [['createdAt', 'DESC']]

    });

    return resp;

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

export async function show(req, h){

  try{
  
    let batch = await models.AchBatch.findOne({where: {id: req.params.batchId}});

    let inputs = await models.AchBatchInput.findAll({where: {batch_id: req.params.batchId}});

    let outputs = await models.AchBatchOutputs.findAll({where: {batch_id: req.params.batchId}});

    return{

       "batch": batch,
       "inputs": inputs,
       "outputs": outputs
    }

  }catch(error){

    return Boom.badRequest(error)

  }


}

export async function achBatchCSV(req, h) {
 
  let content = await ach.createAchBatchCSV( req.params.batchId);

  let filename = `anypay_batch_${req.params.batchId}.csv`

  let response = h.response(content).header("Content-Disposition", `attachment;filename=${filename}`);

  return response;

    
}

