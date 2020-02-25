
import * as anypay from '../../lib';

import { Op } from 'sequelize';

export async function listCities() {

  const cityTags = {
    'city:portsmouth-nh': 'Portsmouth, NH',
    'city:keene-nh': 'Keene, NH',
    'city:dover-nh': 'Dover, NH',
    'city:manchester-nh': 'Manchester, NH',
    'city:bangkok-th': 'Bangkok, TH',
    'city:caracas-ve': 'Caracas, VE',
    'city:exeter-nh': 'Exeter, NH',
  };

  let tags = await anypay.models.AccountTag.findAll({
  
    where: {

      tag: {

        [Op.like]: 'city:%'
      }
    
    },

    include: [{

      model: anypay.models.Account,

      as: 'account',

      attributes: [
        'id',
        'stub',
        'business_name',
        'physical_address',
        'latitude',
        'longitude',
        'image_url'
      ],

      include: [{

        model: anypay.models.Tipjar,

        as: 'tipjars',

        attributes: ['currency', 'address', 'account_id']

      }]

    }]

  });

  const cities = {};

  tags.forEach(tag => {

    if (!cities[tag.tag]) {

      cities[tag.tag] = []
    }

    cities[tag.tag].push(tag.account.toJSON());

  });

  let result = Object.keys(cities).map(tagName => {

    const city = cities[tagName];

    return {
      name: cityTags[tagName],
      city_tag: tagName.split(':')[1],
      accounts: city
    }
  
  })

  return result;

}


