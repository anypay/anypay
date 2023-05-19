import { app } from 'anypay'

import config from './config'

const anypay = app(config.get('anypay_access_token'))

export default anypay

