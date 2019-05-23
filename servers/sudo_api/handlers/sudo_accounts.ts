
import { models, log } from '../../../lib';

import { geocode } from '../../../lib/googlemaps';

export async function update(req, h) {

  let account = await models.Account.findOne({ where: {

    id: req.params.id

  }});

  if (!account) {

    return {

      success: false,

      error: 'account not found'

    }

  }

  let updateAttrs: any = Object.assign(req.orig.payload, {});

  if (updateAttrs.physical_address) {

    try {

      let geolocation = await geocode(updateAttrs.physical_address);

      updateAttrs.latitude = geolocation.lat;
      updateAttrs.longitude = geolocation.lng;

    } catch (error) {

      log.error('error geocoding address', error.message);

    }

  }

  await models.Account.update(updateAttrs, {

    where: { id: req.params.id }

  });

  account = await models.Account.findOne({ where: {

    id: req.params.id

  }});

  return {

    success: true,

    account

  }

}

