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

  actions: {
    didTransition: function() {
      Ember.Logger.info('DID TRANSITION');

      /*
      Ember.$('.ember-google-map').css({
        position: 'fixed',
        top: '50px',
        bottom: '0px',
        left: '0px',
        right: '0px'
      });
      */
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

    Ember.Logger.info('MODEL', model)

    let addressSearchResults = await this.get('addressSearch').getCoordinates('keene, new hampshire')

    Ember.Logger.info('address search results', addressSearchResults)

    model['lat'] = parseFloat(model['lat'])
    model['lng'] = parseFloat(model['lng'])

    /*model.lat = addressSearchResults.lat
    model.lng = addressSearchResults.lng
    */

    controller = ctrl

    var lat = model.lat || 13.737275
    var lng = model.lng || 100.560145

    let { accounts } = await Ember.$.getJSON(`https://api.anypayinc.com/search/accounts/near/${lat}/${lng}?limit=100`)

    Ember.Logger.info('search result', accounts)

    let frequencyIcons = {

      'one-week': '/google-map-marker-512-green.png',

      'one-month': '/google-map-marker-yellow.png',

      'three-months': '/google-map-marker-512.png',

      'inactive': '/google-map-marker-512-grey.png',

      'bitcoincom': '/bitcoincomlogo.png'

    };

    controller.set('icons', frequencyIcons)

    controller.set('mapStyles', [
        {
            "featureType": "all",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "saturation": 36
                },
                {
                    "color": "#000000"
                },
                {
                    "lightness": 40
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#000000"
                },
                {
                    "lightness": 16
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 20
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 17
                },
                {
                    "weight": 1.2
                }
            ]
        },
        {
            "featureType": "administrative.country",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#e5c163"
                }
            ]
        },
        {
            "featureType": "administrative.locality",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#c4c4c4"
                }
            ]
        },
        {
            "featureType": "administrative.neighborhood",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#e5c163"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 20
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 21
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "poi.business",
            "elementType": "geometry",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#e5c163"
                },
                {
                    "lightness": "0"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#e5c163"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 18
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#575757"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#2c2c2c"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 16
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#999999"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 19
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#0077C0"
                },
                {
                    "lightness": 60

                }
            ]
        }
    ]
    )

    controller.set('merchants', accounts.map(merchant => {

      if (!merchant.image_url) {
        merchant.image_url = 'https://media.bitcoinfiles.org/87225dad1311748ab90cd37cf4c2b2dbd1ef3576bbf9f42cb97292a9155e3afb'
      }

      return merchant
       
    }));

    setTimeout(() => {

      //Ember.$('.map').css('position', 'fixed');
    }, 1000);

    Ember.run.scheduleOnce('afterRender', this, function() {                                                                  
      let map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: model.lat, lng: model.lng },
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        zoom: 15,
      });

      var centerChanged = (() => {

        var lastChangedAt;
        
        return function() {

        }

      })()

      console.log('MAP', map)


      map.addListener('center_changed', () => {

        var center = map.getCenter()

        setTimeout(async () => {

          let newCenter = map.getCenter()

          if (center.lat() === newCenter.lat() && center.lng() === newCenter.lng()) {
            Ember.Logger.info('definitive center change', { lat: newCenter.lat(), lng: newCenter.lng() })
            Ember.Logger.info('latlng', newCenter.toJSON())

            let accounts = await getNearbyAccounts(newCenter.lat(), newCenter.lng())

            Ember.Logger.info('accounts', accounts)

            controller.set('merchants', accounts.map(merchant => {

              if (!merchant.image_url) {
                merchant.image_url = 'https://media.bitcoinfiles.org/87225dad1311748ab90cd37cf4c2b2dbd1ef3576bbf9f42cb97292a9155e3afb'
              }

              return merchant
            
            }))
  
          }

        }, 100)

      })

      controller.set('googlemap', map)
      let appCtrl = this.controllerFor('application')
      appCtrl.set('googlemap', map)
      Ember.Logger.info('set google map')

      loadMerchants(map)

      /*Ember.$('.map').css({
        position: 'fixed',
        top: '50px',
        bottom: '0px',
        left: '0px',
        right: '0px'
      });
      */
    });      
  }
});

function loadMerchants(map) {

  Ember.Logger.info('LOAD MERCHANTS')

  let frequencyIcons = {

    'one-week': '/google-map-marker-512-green.png',

    'one-month': '/google-map-marker-yellow.png',

    'three-months': '/google-map-marker-512.png',

    'inactive': '/google-map-marker-512-grey.png',

    'bitcoincom': '/bitcoincomlogo.png'

  };

  var activeMerchants;

  $.ajax({

    method: 'GET',

    url: 'https://api.anypay.global/active-merchants'

  })
  .then(function(resp) {

    activeMerchants = resp;

    return $.ajax({

      method: 'GET',

      url: 'https://api.anypay.global/active-merchant-coins'

    })

  })
  .then(function(resp) {

    var coinsByMerchant = resp.reduce((merchantCoins, merchantCoin) => {

      if (!merchantCoins[merchantCoin.id]) {

        merchantCoins[merchantCoin.id] = [];

      }

      merchantCoins[merchantCoin.id].push(merchantCoin.currency);

      return merchantCoins;

    });


    let oneWeekMerchants = activeMerchants.oneWeek.reduce((sum, i) => {

      sum[i.id] = true;

      return sum;

    }, {});


    let oneMonthMerchants = activeMerchants.oneMonth.reduce((map, i) => {

      map[i.id] = true;

      return map;

    }, {});


    let threeMonthsMerchants = activeMerchants.threeMonths.reduce((map, i) => {

      map[i.id] = true;

      return map;

    }, {});

    let inactiveMerchants = activeMerchants.merchants.reduce((map, i) => {

      map[i.id] = true;

      return map;

    }, {});


    activeMerchants.merchants.forEach(merchant => {

      let markerOpts = {

        position: {

          lat: parseFloat(merchant.latitude),

          lng: parseFloat(merchant.longitude)

        },

        map,

      };

      if (inactiveMerchants[merchant.id]) {

        markerOpts.icon = frequencyIcons['inactive'];

      }

      if (threeMonthsMerchants[merchant.id]) {

        markerOpts.icon = frequencyIcons['three-months'];

      }

      if (oneMonthMerchants[merchant.id]) {

        markerOpts.icon = frequencyIcons['one-month'];

      }

      if (oneWeekMerchants[merchant.id]) {

        markerOpts.icon = frequencyIcons['one-week'];

      }

      if (!markerOpts.icon) {

        return


      }

      var marker = new window.google.maps.Marker(markerOpts);

      marker.addListener('click', function() {

        controller.send('merchantDetailsClicked', merchant)
      });

    });

  });


}
