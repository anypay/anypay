
import * as Boom from 'boom';

import * as shortid from 'shortid';

import { models, square } from '../../../lib';

async function getClient(accountId) {

  let squareCreds = await models.SquareOauthCredentials.findOne({
    where: {

      account_id: accountId,

    },

    order: [["createdAt", "DESC"]]
  
  });

  let squareClient = new square.SquareOauthClient(squareCreds.access_token);

  return squareClient;

}

export async function index (req, h) {

  try {

    let squareClient = await getClient(req.account.id);

    let catalog = await squareClient.fullCatalog();

    createProductsForCatalog(catalog, req.account.id);

    let grab_and_go_items = await models.Product.findAll({ where: {

      account_id: req.account.id

    }});

    console.log('grab and go items created');

    return { grab_and_go_items, catalog };

  } catch(error) {

    console.log(error);

    return Boom.badRequest(error.message);

  }

}

export async function show (req, h) {

  let squareClient = await getClient(req.account.id);

  try {

    
    let catalogObject = await squareClient.getCatalogObject(req.params.object_id);

    return catalogObject;

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

async function createProductsForCatalog(catalog, account_id) {

  let catalogObjects = catalog.objects.filter(obj => {

    return obj.type === 'ITEM';
      
  })

  var items = [];

  for (let i=0; i < catalogObjects.length; i++) {

    let catalogObject = catalogObjects[i];

    var price;

    try {

      price = catalogObject.item_data.variations[0].item_variation_data.price_money.amount / 100.00;

    } catch(error) {

      price = 0.00;

    }

    var record, isNew;

    try {

      [record, isNew] = await models.Product.findOrCreate({

        where: {

          square_catalog_object_id: catalogObject.id,

          account_id
        },

        defaults: {

          square_catalog_object_id: catalogObject.id,

          name: catalogObject.item_data.name,

          square_variation_id: catalogObject.item_data.variations[0].id,

          price,

          uid: shortid.generate(),

          account_id

        }
      })

    } catch(error) {

      continue;

    }

    if (isNew) {

      console.log('new record created', record.toJSON());

    } else {
   
      try {

        price = catalogObject.item_data.variations[0].item_variation_data.price_money.amount / 100.00;

      } catch(error) {

        price = 0.00;

      }

      record.price = price;

      await record.save();
 
      console.log('old record found', record.toJSON());
    }

    console.log('PUSH', record.toJSON());

    items.push(record);
  
  };

  return items;

}

