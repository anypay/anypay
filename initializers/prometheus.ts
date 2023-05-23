
import { Anypay } from '../lib'

export default async function({log, models, orm, App, AccessToken}: Anypay) {

  log.info('initializers.prometheus')

  try {

    const [app, isNew] = await App.findOrCreate({
      where: {
        name: 'prometheus',
        account_id: 1
      }
    })

    if (isNew) {

      const { uid } = await AccessToken.create({
        app_id: app.get('id'),
        account_id: 1
      })

      console.log('=======   Prometheus Access Token Generated   =======')
      console.log(`=======                                       =======`)
      console.log(`=======  ${uid}  =======` )
      console.log(`=======                                       =======`)
      console.log('=====================================================')

    }

  } catch(error) {

    console.error('error initializing prometheus', error)

  }

}
