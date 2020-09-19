
import { models } from './models'

export async function getMerchantApiKey(account_id) {

  let token = await models.AccessToken.findOne({
    where: {
      account_id
    },
    order: [["createdAt", "asc"]]
  })

  return token.uid

}
