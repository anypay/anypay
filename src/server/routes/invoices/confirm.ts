import { ServerRoute } from '@hapi/hapi'
import { confirmInvoice } from '@/lib/confirmations'
import Joi from 'joi'
import { log } from '@/lib/log'

export default {
  method: 'GET',
  path: '/api/v1/invoices/{uid}/confirm',
  options: {
    description: 'Manually trigger confirmation check for an invoice',
    tags: ['api', 'invoices'],
    validate: {
      params: Joi.object({
        uid: Joi.string().required().description('Invoice UID')
      })
    },
    response: {
      schema: Joi.object({
        success: Joi.boolean(),
        payment: Joi.object().allow(null),
        confirmation: Joi.object().allow(null)
      })
    }
  },
  handler: async (request, h) => {
    const { uid } = request.params

    log.info('Manual invoice confirmation requested', { uid })

    try {
      const result = await confirmInvoice(uid)
      
      return {
        success: true,
        payment: result.payment,
        confirmation: result.confirmation
      }
    } catch (error) {
      log.error('Error in invoice confirmation endpoint', error)
      
      return h.response({
        success: false,
        error: 'Failed to confirm invoice'
      }).code(500)
    }
  }
} as ServerRoute 