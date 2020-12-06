import Ember from 'ember';
import $ from 'jquery'
import { inject as service } from '@ember/service'

async function getNearbyAccounts(lat, lng) {
  $('#loader-wrapper').show()

  let { accounts } = await Ember.$.getJSON(`https://api.anypayinc.com/search/accounts/near/${lat}/${lng}?limit=100`)
  $('#loader-wrapper').hide()

  return accounts

}

var controller

export default Ember.Route.extend({

  addressSearch: service('address-search'),
  'merchant-map': service(),

  actions: {
    didTransition: function() {
      Ember.Logger.info('DID TRANSITION');
    }
  },

  model(params) {
    Ember.Logger.info('MODEL', params)
    
    var model = {}

    model['lat'] = parseFloat(params['lat'])
    model['lng'] = parseFloat(params['lng'])

    return model

  },

  async setupController(ctrl, model) {

    Ember.run.scheduleOnce('afterRender', this, async function() {

      Ember.Logger.info('MODEL', model)

      let addressSearchResults = await this.get('addressSearch').getCoordinates('keene, new hampshire')

      Ember.Logger.info('address search results', addressSearchResults)

      model['lat'] = parseFloat(model['lat'])
      model['lng'] = parseFloat(model['lng'])

      let map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: model.lat, lng: model.lng },
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        zoom: 15,
      });

      let merchantMap = new MerchantMap(map)

      controller = ctrl

      var lat = model.lat || 13.737275
      var lng = model.lng || 100.560145

      let { accounts } = await Ember.$.getJSON(`https://api.anypayinc.com/search/accounts/near/${lat}/${lng}?limit=100`)

      merchantMap.setNearbyMerchants(accounts)

      controller.set('icons', merchantMap.frequencyIcons)

      controller.set('mapStyles', this.get('merchant-map').getStyles())

      controller.set('merchants', accounts.map(merchant => {

        if (!merchant.image_url) {
          merchant.image_url = 'https://media.bitcoinfiles.org/87225dad1311748ab90cd37cf4c2b2dbd1ef3576bbf9f42cb97292a9155e3afb'
        }

        return merchant
         
      }));

      merchantMap.map.addListener('center_changed', () => {

        var center = merchantMap.map.getCenter()

        setTimeout(async () => {

          let newCenter = merchantMap.map.getCenter()

          if (center.lat() === newCenter.lat() && center.lng() === newCenter.lng()) {
            Ember.Logger.info('definitive center change', { lat: newCenter.lat(), lng: newCenter.lng() })
            Ember.Logger.info('latlng', newCenter.toJSON())

            let merchants = await getNearbyAccounts(newCenter.lat(), newCenter.lng())

            merchantMap.setNearbyMerchants(merchants)

            Ember.Logger.info('merchants', merchants)

            controller.set('merchants', merchants.map(merchant => {

              if (!merchant.image_url) {
                merchant.image_url = 'https://media.bitcoinfiles.org/87225dad1311748ab90cd37cf4c2b2dbd1ef3576bbf9f42cb97292a9155e3afb'
              }

              return merchant
            
            }))
  
          }

        }, 10)

      })

      controller.set('googlemap', merchantMap.map)
      let appCtrl = this.controllerFor('application')
      appCtrl.set('googlemap', merchantMap.map)
      Ember.Logger.info('set google map')


      loadMerchants(merchantMap)

    });      
  }
});

class MerchantMap {

  constructor(map) {

    this.map = map

    this.icons = {}

    this.merchants = {} // indexed by merchant ID

    this.frequencyIcons = {

      'one-week': '/google-map-marker-512-green.png',

      'one-month': '/google-map-marker-yellow.png',

      'three-months': '/google-map-marker-512.png',

      'inactive': '/google-map-marker-512-grey.png',

      'bitcoincom': '/bitcoincomlogo.png'

    }
  }

  setNearbyMerchants(merchants) {
    merchants.forEach(merchant => {
      this.merchants[merchant.id] = merchant
    })
  }

  setMap(map) {
    this.map = map
  }

  setMerchantIcon(merchant) {

    let markerOpts = {

      position: {

        lat: parseFloat(merchant.latitude),

        lng: parseFloat(merchant.longitude)

      },

      map: this.map,

    };

    if (this.inactiveMerchants[merchant.id]) {

      markerOpts.icon = this.frequencyIcons['inactive'];

    }

    if (this.threeMonthsMerchants[merchant.id]) {

      markerOpts.icon = this.frequencyIcons['three-months'];

    }

    if (this.oneMonthMerchants[merchant.id]) {

      markerOpts.icon = this.frequencyIcons['one-month'];

    }

    if (this.oneWeekMerchants[merchant.id]) {

      markerOpts.icon = this.frequencyIcons['one-week'];

    }

    if (!markerOpts.icon) {

      return

    }

    var marker = new window.google.maps.Marker(markerOpts);

    marker.addListener('click', () => {

      console.log('this.merchants', this.merchants)

      controller.send('merchantDetailsClicked', this.merchants[merchant.id])

    });

  }

  async getAllActiveMerchants() {

    this.allActiveMerchants = await $.ajax({

      method: 'GET',

      url: 'https://api.anypay.global/active-merchants'

    })

    this.allActiveMerchants.merchants.forEach(merchant => {
      if (!this.merchants[merchant.id]) {
        this.merchants[merchant.id] = merchant
      }
    })

    return this.allActiveMerchants

  }
}

async function loadMerchants(merchantMap) {

  window.merchantMap = merchantMap

  Ember.Logger.info('LOAD MERCHANTS')

  await merchantMap.getAllActiveMerchants()

  let activeMerchants = merchantMap.allActiveMerchants

  merchantMap.oneWeekMerchants = activeMerchants.oneWeek.reduce((sum, i) => {

    sum[i.id] = true;

    return sum;

  }, {});


  merchantMap.oneMonthMerchants = activeMerchants.oneMonth.reduce((map, i) => {

    map[i.id] = true;

    return map;

  }, {});


  merchantMap.threeMonthsMerchants = activeMerchants.threeMonths.reduce((map, i) => {

    map[i.id] = true;

    return map;

  }, {});

  merchantMap.inactiveMerchants = activeMerchants.merchants.reduce((map, i) => {

    map[i.id] = true;

    return map;

  }, {});


  activeMerchants.merchants.forEach(merchant => merchantMap.setMerchantIcon(merchant))

}
