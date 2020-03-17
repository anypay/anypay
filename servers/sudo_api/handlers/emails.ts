
import * as Boom from 'boom';

import { models, database } from '../../../lib';

import * as fs from 'fs';

import { promisify } from 'util';

const readFile = promisify(fs.readFile);

export async function index(req, h) {

  try {

    let emails = await models.Email.findAll();

    emails = await Promise.all(emails.map(async (email) => {

      let numberSent = await database.query(`select count(*) from
        "EmailDeliveries" where uid is not null and email_id = ${email.id}`);

      let numberFailed = await database.query(`select count(*) from
        "EmailDeliveries" where uid is null and error is not null and email_id = ${email.id}`);

      var email_content;

      try {

        email_content = require(`${process.cwd()}/emails/${email.name}`).default;

      } catch(error) {

        console.log('error getting email template', email.name);

      }

      console.log(`num sent ${email.name}:`, numberSent);
      console.log(`num failed ${email.name}`, numberFailed);

      let e = Object.assign(email.toJSON(), {
        deliveries_sent: parseInt(numberSent[0][0].count),
        deliveries_failed: parseInt(numberFailed[0][0].count),
        email_content
      })

      console.log(e);

      return e;

    }));

    console.log('emails', emails);

    return { emails }

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

