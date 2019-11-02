
import { log, models, tipjar } from '../../../lib';

export async function show(request, h) {

  return tipjar.getTipJarAndBalance(request.account_id, request.params.currency)

}

export async function index(request, h) {

  let tipjars = await models.Tipjar.findAll({ where: {

    account_id: request.account.id

  }});

  return Promise.all(

    tipjars.map(jar => {

      return tipjar.getTipJarAndBalance(request.account.id, jar.currency);

    })
  )

}


