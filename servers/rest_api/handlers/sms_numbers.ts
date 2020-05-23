
import { models } from '../../../lib';
import { badRequest, notFound} from 'boom';

export async function index(req, h) {

  let sms_numbers = await models.AccountPhoneSms.findAll({
    where: { account_id: req.account.id }
  })

  return { sms_numbers }

}

export async function create(req, h) {

  console.log('sms_numbers.create', req.payload);

  try {

    let [sms_number] = await models.AccountPhoneSms.findOrCreate({
      where: {
        account_id: req.account.id,
        phone_number: req.payload.phone_number
      },
      defaults: {
        account_id: req.account.id,
        phone_number: req.payload.phone_number,
        name: req.payload.name
      }
    })

    return { sms_number }

  } catch(error) {

    return badRequest(error.message);
  }

}

export async function destroy(req, h) {

  try {

    let phone_number = await models.AccountPhoneSms.findOne({
      where: {
        account_id: req.account.id,
        id: req.params.id
      }
    });

    if (!phone_number) {
      return notFound();
    }

    await phone_number.destroy();

    return h.response('success').code(200);

  } catch(error) {

    return badRequest(error.message);

  }

}

export async function update(req, h) {

  let phone_number = await models.AccountPhoneSms.findOne({
    where: {
      account_id: req.account.id,
      id: req.params.i
    }
  });
  
  if (!phone_number) {
    return notFound();
  }

  phone_number.name = req.payload.name;

  await phone_number.save();

  return h.response('success').code(200);

}
