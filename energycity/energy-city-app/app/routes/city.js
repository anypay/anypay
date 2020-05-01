
import Ember from 'ember';

import { inject as service } from '@ember/service';

export default Ember.Route.extend({

  //geolocation: service(),

  cities: service(),

  socketIOService: service('socket-io'),

  model(params) {

    return this.get('cities').getCity(params.city);

  },

  async setupController(controller, model) {
    /*

    let location = await this.get("geolocation").getLocation();

    console.log(model);

    controller.set('city', model);
    controller.set('location', location);

    console.log('location', location);
    */

    Ember.Logger.info('city', { city: model });

    let locations = model.accounts.map(account => {

      let assign = {}

      let bch_tipjar = account.tipjars.find(jar => jar.currency === 'BCH');

      if (bch_tipjar) {

        assign['bch_tipjar'] = bch_tipjar;

      }

      let bsv_tipjar = account.tipjars.find(jar => jar.currency === 'BSV');

      if (bsv_tipjar) {

        assign['bsv_tipjar'] = bsv_tipjar;

      }

      let dash_tipjar = account.tipjars.find(jar => jar.currency === 'DASH');

      if (dash_tipjar) {

        assign['dash_tipjar'] = dash_tipjar;

      }

      return Object.assign(account, assign);

    });

    console.log(locations);

    controller.set('locations', locations);

    const socket = this.get("socketIOService").socketFor('wss://nrgcty.com');
    controller.set('socket', socket);

    socket.on('invoice.created', controller.handleInvoiceCreated, controller);
    socket.on('invoice.paid', controller.handleInvoicePaid, controller);

    socket.on('close', () => {
      controller.set('connected', false);
      Ember.Logger.info('socket.disconnected');
    });

    socket.on('error', (error) => {
      Ember.Logger.info('socket.error', error.message); 
    });

  }

});

