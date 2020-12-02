
import { models } from './models'

const WOOCOMMERCE_DEFAULT_IMAGE_URL = 'https://media.bitcoinfiles.org/65602243db575e3c275d6f12daff4c35860c26176f44ca88ff9d271d8201e686.jpeg'

export async function getSettings(account_id: number) {

  let coins = await models.Address.findAll({

    where: { account_id }

  })

  let settings = await models.WoocommerceSetting.findOne({

    where: {

      account_id
    }

  })

  if (!settings) {

    settings = {

      image_url: WOOCOMMERCE_DEFAULT_IMAGE_URL

    }

  }

  settings.coins = coins.map(coin => {

    return coin.currency

  });

  return settings

}
