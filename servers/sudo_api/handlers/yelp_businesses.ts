
import { models } from '../../../lib';
import { getMongodb } from '../../../lib/mongodb';
import { Readable } from 'stream';

import { badRequest } from 'boom';

export async function index(req, h) {

  let mongodb = await getMongodb();

  try {

    //return models.YelpBusiness.findAll();

    return  mongodb.collection('yelp_businesses').find().toArray();

  } catch(error) {

    return badRequest(error.message);

  }

}

