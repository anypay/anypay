import * as Sequelize from 'sequelize';
import * as sequelize from './database';

import { join } from 'path';
import { awaitChannel } from './amqp';
import { log } from './logger';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

var models: any = require('require-all')({
  dirname: join(__dirname, 'models'),
  map: function(name, path) {
    return name.split('_').map(p => {

      return capitalizeFirstLetter(p);    

    })
    .join('');
  },
  resolve: (model) => model(sequelize, Sequelize)
});

Object.values(models).forEach(async (model: any) => {

  var name = model.options.name.singular;

  model.addHook('afterCreate', async (instance) => {

    let channel = await awaitChannel();

    let event = `models.${name}.created`;

    let data = instance.toJSON()

    log.info(event, data);

    await channel.publish('anypay.events', event, new Buffer(JSON.stringify(data)));

  });

  model.addHook('afterCreate', async (instance) => {

    let channel = await awaitChannel();

    let event = `models.${name}.updated`;

    let data = instance.toJSON()

    log.info(event, data);

    await channel.publish('anypay.events', event, new Buffer(JSON.stringify(data)));

  });

  model.addHook('afterDestroy', async (instance) => {

    let channel = await awaitChannel();

    let event = `models.${name}.destroyed`;

    let data = instance.toJSON()

    log.info(event, data);

    await channel.publish('anypay.events', event, new Buffer(JSON.stringify(data)));

  });

  model.addHook('validationFailed', async (instance, options, error) => {

    let channel = await awaitChannel();

    let event = `models.${name}.validationfailed`;

    let data = {
      instance: instance.toJSON(),
      error: error.message
    };

    log.info(event, data);

    await channel.publish('anypay.events', event, new Buffer(JSON.stringify(data)));

  });

});

export { models };

