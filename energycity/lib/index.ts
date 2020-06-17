
import * as anypay from '../../lib';
import { database } from "../../lib";

import { Op } from 'sequelize';

export async function listCities() {

  /*
  const cityTags = {
    'city:portsmouth-nh': 'Portsmouth, NH',
    'city:keene-nh': 'Keene, NH',
    'city:dover-nh': 'Dover, NH',
    'city:manchester-nh': 'Manchester, NH',
    'city:bangkok-th': 'Bangkok, TH',
    'city:caracas-ve': 'Caracas, VE',
    'city:exeter-nh': 'Exeter, NH',
  };
   */
  let query = `select cities.tag, count(*) from cities inner join account_tags on cities.tag = account_tags.tag group by cities.tag;`

  let cityTags = await database.query(query);

  let cityRecords = await anypay.models.City.findAll({

    where: {

      tag: cityTags[0].map(t => t.tag)

    }

  });

  let cityRecordsTagMap = cityRecords.reduce(function(map, record) {

    map[record.tag] = record;

    return map;

  }, {});

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

    let record = cityRecordsTagMap[tagName]

    return {
      city: record,
      name: record.name,
      city_tag: tagName.split(':')[1],
      accounts: city
    }
  
  })

  result = result.sort((a,b) => {

    if (a.name === 'Porcfest') {

      return -1

    }
    if (b.name === 'Porcfest') {

      return 1;

    }

    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());


  });

  return result;

}


