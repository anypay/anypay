#!/usr/bin/env ts-node

require('dotenv').config();

var program = require('commander');
var Table = require('cli-table');

<<<<<<< HEAD
import {listAll, register} from '../lib/ambassadors';
=======
import {
  listAll,
  register,
  claimBusiness
} from '../lib/ambassadors';
>>>>>>> f01154dc6cd50fe8b78ccd947052514dc8ca6a1d

function renderTable() {

}

program
  .command('register <email> [name]')
  .action(async (email, name) => {

    let ambassador = await register(email, name);

    console.log(ambassador.toJSON());

<<<<<<< HEAD
=======
    process.exit(0);

  });

program
  .command('claimbusiness <ambassador_email> <merchant_email>')
  .action(async (ambassadorEmail, merchantEmail) => {

    let claim = await claimBusiness(ambassadorEmail, merchantEmail);

    console.log(claim);

    process.exit(0);

>>>>>>> f01154dc6cd50fe8b78ccd947052514dc8ca6a1d
  });

program
  .command('listall')
  .action(async () => {

    var ambassadors;

    try {

      ambassadors = await listAll();

    } catch(error) {

      console.error(error.message);

    }

    var table = new Table({
      head: ['ID', 'Account ID', 'Name']
    });
    
    if (!ambassadors) {

      console.log('no ambassadors');

      process.exit();
    }

    for (let i=0; i<ambassadors.length; i++) {

      let ambassador = ambassadors[i];

      table.push([
        ambassador.id,
        ambassador.account_id,
        ambassador.name
      ]);

    }

    console.log(table.toString());

    process.exit(0);

  });

program.parse(process.argv);

