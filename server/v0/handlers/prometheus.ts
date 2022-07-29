
import { prometheus } from '../../../lib/prometheus'

import { log } from '../../../lib/log'

export async function show(req, h) {

  log.debug('api.v0.prometheus.show', { path: req.path })

  return h
    .response(await prometheus.register.metrics())
    .type(prometheus.register.contentType);

}

