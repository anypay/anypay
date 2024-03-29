import AuthenticatedRequest from '../../auth/AuthenticatedRequest';
import { ResponseToolkit } from '@hapi/hapi';
import prisma from '../../../lib/prisma';

export async function index(request: AuthenticatedRequest, h: ResponseToolkit) {

  const coins = await prisma.addresses.findMany({
    where: {
      account_id: request.account.id
    }
  })
  
  const settings = await prisma.woocommerceSettings.findFirst({
    where: {

      account_id: request.account.id
    }

  })

  const settingsCoins = coins.map((coin: { currency: string | null}) => {

    return coin.currency
  });

  if (settings) {

    return { settings: {...settings, coins: settingsCoins } }

  } else {

    var defaultSettings = {

      image_url: 'https://media.bitcoinfiles.org/65602243db575e3c275d6f12daff4c35860c26176f44ca88ff9d271d8201e686.jpeg',
      coins: settingsCoins

    }

    return { settings: defaultSettings }
  

  }



}

