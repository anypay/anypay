
import { models, log, addresses } from '../../..';

export async function destroy(req, h) {

  try {

    let address = await models.Address.findOne({ where: {
      account_id: req.account.id,
      currency: req.params.currency
    }})

    if (address) {
      await address.destroy()
    }

    return { success: true };
 
  } catch(error) {

    log.error('server.v0.handlers.addresses.update', error)

    return h.badRequest(error)

  }

};

export async function list(request, h) {
  try {

    let addresses = {};

    let accountAddresses = await models.Address.findAll({

      where: { account_id: request.account.id }

    })
    
    accountAddresses.forEach(address => {

      addresses[address.currency] = address.value;

    });

    return h.json(addresses);

  } catch(error) {

    log.error('server.v0.handlers.addresses.update', error)

    return h.badRequest(error)

  }

}

export async function index(req, h) {

  let addresses = await models.Address.findAll({

    where: { account_id: req.account.id }

  })
  
  return { addresses };

};

export async function update(request, h) {

  try {

    const { account } = request

    const { currency } = request.params

    const value = request.payload.address

    const address = await addresses.setAddress(account, { currency, value });

    h.json({ address: address.toJSON() })

  } catch(error) {

    log.error('server.v0.handlers.addresses.update', error)

    return h.badRequest(error)

  }


}

export async function handler_name(request, h) {

  try {

    request.log.info('')

    return h.json({ success: true })

  } catch(error) {

    request.log.error('server.handlers.handler_name', error)

    return h.badRequest(error)

  }
}
