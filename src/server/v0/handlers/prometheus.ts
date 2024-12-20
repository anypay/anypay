
import { Request, ResponseToolkit } from '@hapi/hapi';
import { prometheus } from '@/lib/prometheus'

export async function show(request: Request, h: ResponseToolkit) {

  return h
    .response(await prometheus.register.metrics())
    .type(prometheus.register.contentType);

}

