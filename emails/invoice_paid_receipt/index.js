import { readFileSync } from 'fs';
import { join } from 'path';
import * as Handlebars from 'handlebars';

let body = readFileSync(join(__dirname, 'email.html'));

let template = Handlebars.compile(body.toString());

export default {

  title: "Anypay Payment Received - Invoice Receipt",

  template,

  body: template({})

}

