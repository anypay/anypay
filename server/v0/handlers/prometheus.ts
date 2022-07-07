
import { prometheus } from '../../../lib/prometheus'

export async function show(req, h) {

  return h
    .response(await prometheus.register.metrics())
    .type(prometheus.register.contentType);

}

