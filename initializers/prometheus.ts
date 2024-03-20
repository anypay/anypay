
import { Anypay } from '../lib'
import { createApp } from '../lib/apps'
import prisma from '../lib/prisma'
import * as uuid from 'uuid'

export default async function({log}: Anypay) {

  log.info('initializers.prometheus')

  try {

    let app = await prisma.apps.findFirst({
      where: {
        name: 'prometheus',
        account_id: 1
      }
    })

    var isNew = app ? false : true

    if (!app) {
        
        app = await createApp({
          name: 'prometheus',
          account_id: 1,
        })

    }

    if (isNew) {

      const accessToken = await prisma.access_tokens.create({
        data: {
          app_id: app.id,
          account_id: 1,
          uid: uuid.v4(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })


      console.log('=======   Prometheus Access Token Generated   =======')
      console.log(`=======                                       =======`)
      console.log(`=======  ${accessToken.uid}  =======` )
      console.log(`=======                                       =======`)
      console.log('=====================================================')

    }

  } catch(error) {

    console.error('error initializing prometheus', error)

  }

}
