
import axios from 'axios'

import { log } from '../../../lib/log'

import { getAccountSetting, setAccountSetting } from '../../../lib/settings'

const files = {
  'XMR': 'https://doge.bitcoinfiles.org/406e0f115578598c4364ea42aa3887e8aeccf513d948c183054c42d12782cd38',
  'DASH': 'https://doge.bitcoinfiles.org/a5f08a3aad5e97da45515b70c7d09dac75baf107ddc1176bf676cad0e347d2d1',
  'BCH': 'https://doge.bitcoinfiles.org/c028b3d5843fb65da41555a090963da84b80356492f6950bc573d4ec9c3af3f2',
  'BTC': 'https://doge.bitcoinfiles.org/f353b39f04ad62840adce8102f0c5b8e538c89b4a8ff81326de21cc314593d71',
  'BSV': 'https://doge.bitcoinfiles.org/04271bbc9dc1e77527c26699938e082a5f1a1deed758a9e9d6d72c9c8bc7c142',
  'LTC': 'https://doge.bitcoinfiles.org/14585ce9b3b58154c87668234221db2dc4b2ce7352925d896daad47d12714f09',
  'DOGE': 'https://doge.bitcoinfiles.org/322c7e091fb9ea4ed0fd170da6c2f05c58075eafaeff21015381443e31680c9b',
  'ANYPAY': 'https://doge.bitcoinfiles.org/31bc517ddae2134408f15acd582606ffe493e4d3800e8a60250899c61ace9bb3'
}

export async function image(request, hapi) {

  try {

    let image = await getAccountSetting(request.params.account_id, 'woocommerce.checkout.image', { default: 'ANYPAY' })

    const url = files[image]

    const { data } = await axios.get(url, {
      responseType: 'arraybuffer'
    })

    return hapi.response(data).header(
      'Content-Type', 'image/png'
    )

  } catch(error) {

    console.error(error)

    return hapi.response({ error: error.message }).code(500)

  }

}

export async function show(request, hapi) {

  try {

    let image = await getAccountSetting(request.account.id, 'woocommerce.checkout.image', { default: 'ANYPAY' })

    const url = files[image]

    return hapi.response({
      image: {
        name: image,
        url
      }
    })

  } catch(error) {

    console.error(error)

    return hapi.response({ error: error.message }).code(500)

  }

}

export async function index(request, h) {

  log.debug('api.v1.woocommerce_checkout_images.index', { path: request.path })

  return h.response({ images: files }).code(200)

}

export async function update(request, hapi) {

  let url = files[request.payload.name]

  if (url) {

    await setAccountSetting(request.account.id, 'woocommerce.checkout.image', request.payload.name)

  }

  return hapi.response({ name: request.payload.name, url }).code(200)

}

