
import { geocode } from './googlemaps';
import * as models from './models';
import { getDistance } from 'geolib';

import * as Sequelize from 'sequelize';

export async function getCoordinates(address) {

  let location = await geocode(address);

  return {
    latitude: location.lat, 
    longitude: location.lng
  };

}

export async function getNearbyMerchants(coordinates) {
  console.log('coordinates', coordinates);

  let accounts = await models.Account.findAll({
    where: {
      business_name: {
        [Sequelize.Op.ne]: null
      },
      physical_address: {
        [Sequelize.Op.ne]: null
      },
      latitude: {
        [Sequelize.Op.ne]: null
      },
      longitude: {
        [Sequelize.Op.ne]: null
      }
    }
  });

  let accountsWithDistance = accounts.map(a => {

    let account: any = Object.create(a);

    let location = {
      latitude: account.latitude,
      longitude: account.longitude
    }

    let distance = getDistance(coordinates, {
      latitude: account.latitude,
      longitude: account.longitude
    });

    account.distance = distance;

    return account;

  });

  return accountsWithDistance.sort((a,b) => {
    console.log(a.distance, b.distance);

    if (a.distance > b.distance) {
      return 1
    }

    if (a.distance < b.distance) {

      return -1;
    }

    if (a.distance === b.distance) {
      return 0;
    }

  });

}

