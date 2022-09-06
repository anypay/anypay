require('dotenv').config();

import { models } from './models'

export async function addToCity(email: string, city:string, stub?: string) {

  email = email.toLowerCase();

  let cityRecord = await models.City.findOne({ where: {

    tag: `city:${city}`

  }});

  if (!cityRecord) {
    throw new Error(`city ${city} not found`);
  }

  let account = await models.Account.findOne({ where: { email }});

  if (!stub && !account.stub) {

    stub = account.business_name.replace(' ', '-');

    account.stub = stub;

    await account.save();

  } else if (!account.stub) {

    account.stub = stub;  

    await account.save()

  }

  let [tag] = await models.AccountTag.findOrCreate({

    where: {
      tag: `city:${city}`,
      account_id: account.id
    },
    defaults: {
      tag: `city:${city}`,
      account_id: account.id
    }

  });

  return tag;

}

