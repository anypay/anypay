
import { badRequest } from 'boom'

import { leaderboard } from '../../../lib'

export async function index(req, h) {

  try {

    let list: any = await leaderboard.list();

    //let l: leaderboard.Leaderboard = await leaderboard.getLeaderboard();

    //return leaderboard.sanitizeLeaderboard(l);

    list = list.map(item => {

      let account = item.account;

      delete account.email;

      return {
        count: item.count,
        account: {
          id: account.id,
          uid: account.uid,
          business_name: account.business_name,
          image_url: account.image_url,
          website_url: account.website_url,
          google_place_id: account.google_place_id,
          physical_address: account.physical_address,
          latitude: account.latitude,
          longitude: account.longitude
        }
      }
    });

    return { leaderboard: list }

  } catch(error) {

    return badRequest(error)

  }

}

