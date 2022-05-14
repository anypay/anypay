require('dotenv').config()

import * as Boom from 'boom'

const sequelize = require("../../lib/database");

import { v1, failAction } from '../handlers'

import { useJWT } from '../auth/jwt'

const AuthBearer = require('hapi-auth-bearer-token');

import * as Joi from '@hapi/joi'

export async function attachV1Routes(server) {

  await server.register(AuthBearer)

  server.auth.strategy("jwt", "bearer-access-token", useJWT());

  server.route({
    method: "POST",
    path: "/v1/api/account/register",
    handler: v1.AccountRegistrations.create,
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().required()
        }),
        failAction
      }
    },
  });

  server.route({
    method: "POST",
    path: "/v1/api/account/login",
    handler: v1.AccountLogins.create,
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().required()
        }),
        failAction
      },
    },
  });

  server.route({
    method: "POST",
    path: "/v1/api/account/password-reset",
    handler: v1.PasswordResets.create,
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required()
        }),
        failAction
      },
    },
  });

  server.route({
    method: "GET",
    path: "/v1/api/account/my-account",
    options: {
      auth: "jwt"
    },
    handler: v1.MyAccount.show
  });

  server.route({
    method: "GET",
    path: "/v1/api/account/access-keys",
    options: {
      auth: "jwt"
    },
    handler: v1.AccessKeys.index
  });

  server.route({
    method: 'GET',
    path: '/v1/api/webhooks',
    options: {
      auth: "jwt"
    },
    handler: v1.Webhooks.index
  }); 

  server.route({
    method: 'GET',
    path: '/v1/api/account/payments',
    options: {
      auth: "jwt",
      validate: {
        query: Joi.object({
          limit: Joi.number().optional(),
          offset: Joi.number().optional()
        }),
        failAction
      },
      response: {
        failAction: 'log',
        schema: v1.Payments.Schema.listPayments
      }
    },
    handler: v1.Payments.index
  }); 

  server.route({
    method: 'POST',
    path: '/v1/api/webhooks/{invoice_uid}/attempts',
    options: {
      auth: "jwt"
    },
    handler: v1.Webhooks.attempt
  }); 

  server.route({
    method: "POST",
    path: "/v1/api/invoices",
    handler: v1.Invoices.create,
    options: {
      auth: "jwt",
      validate: {
        payload: Joi.object({
          amount: Joi.number().min(0).required(),
          denomination: Joi.string().optional(),
          currency: Joi.string().optional()
        }),
        failAction
      },
    },
  });

  server.route({
    method: "GET",
    path: "/v1/api/invoices/{invoice_uid}/events",
    handler: v1.InvoiceEvents.index,
    options: {
      auth: "jwt",
      validate: {
        params: Joi.object({
          invoice_uid: Joi.string().required()
        }),
        query: Joi.object({
          order: Joi.string().valid('asc', 'desc').optional()
        }),
        failAction
      },
      response: {
        schema: Joi.object({
          invoice_uid: Joi.string().required(),
          events: Joi.array().items(Joi.object({
            id: Joi.number().required(),
            account_id: Joi.number().optional(),
            type: Joi.string().required(),
            payload: Joi.object().optional(),
            createdAt: Joi.date().required(),
            updatedAt: Joi.date().required()
          }))
        })
      }
    },
  });

  server.route({
    method: "GET",
    path: "/v1/api/account/events",
    handler: v1.AccountEvents.index,
    options: {
      auth: "jwt",
      response: {
        schema: Joi.object({
          account_id: Joi.number().required(),
          events: Joi.array().items(Joi.object({
            id: Joi.number().required(),
            account_id: Joi.number().optional(),
            type: Joi.string().required(),
            payload: Joi.object().optional(),
            createdAt: Joi.date().required(),
            updatedAt: Joi.date().required()
          }))
        })
      }
    },
  });

  server.route({
    method: 'POST',
    path: '/v1/api/account/addresses',
    options: {
      auth: "jwt",
      validate: {
        payload: Joi.object({
          currency: Joi.string().required(),
          value: Joi.string().required(),
          label: Joi.string().optional()
        }),
        failAction
      },
      response: {
        failAction: 'log',
        schema: Joi.object({
          address: Joi.object({
            currency: Joi.string().required(),
            value: Joi.string().required(),
            label: Joi.string().optional()
          })
        })
      }
    },
    handler: v1.Addresses.update
  }); 

  server.route({
    method: 'DELETE',
    path: '/v1/api/account/addresses/{currency}',
    options: {
      auth: "jwt",
      validate: {
        params: Joi.object({
          currency: Joi.string().required()
        }),
        failAction
      },
      response: {
        failAction: 'log',
        schema: Joi.object({
          address: Joi.object({
            success: Joi.boolean()
          })
        })
      }
    },
    handler: v1.Addresses.remove
  }); 

  server.route({
    method: 'GET',
    path: '/v1/api/account/addresses',
    options: {
      auth: "jwt",
      response: {
        failAction: 'log',
        schema: Joi.object({
          addresses: Joi.array().items(Joi.object({
            currency: Joi.string().required(),
            code: Joi.string().required(),
            name: Joi.string().required(),
            enabled: Joi.boolean().required(),
            price: Joi.number().required(),
            icon: Joi.string().required(),
            address: Joi.string().required(),
            supported: Joi.boolean().required(),
            wallet: Joi.string().optional(),
            note: Joi.string().optional()
          }))
        })
      }
    },
    handler: v1.Addresses.index
  }); 

  server.route({
    method: 'GET',
    path: '/v1/api/system/coins',
    options: {
      response: {
        failAction: 'log',
        schema: Joi.object({
          addresses: Joi.array().items(Joi.object({
            code: Joi.string().required(),
            name: Joi.string().required(),
            enabled: Joi.boolean().required(),
            price: Joi.number().required(),
            icon: Joi.string().required()
          }))
        })
      }
    },
    handler: v1.Coins.index
  }); 

  server.route({
    method: 'POST',
    path: '/v1/api/test/webhooks',
    handler: v1.Webhooks.test
  }); 

  server.route({
    method: 'POST',
    path: '/v1/api/fail',
    handler: (req, h) => { return h.response(200) },
    options: {
      validate: {
        query: Joi.object({
          error: Joi.string().required()
        }).required(),
        headers: Joi.object({
          'fail': Joi.string().required()
        }),
        //failAction
      }
    }
  }); 

  server.route({
    method: "GET",
    path: "/v1/woocommerce/checkout_images",
    handler: v1.WoocommerceCheckoutImages.index,
  })

  server.route({
    method: "GET",
    path: "/v1/woocommerce/checkout_image",
    handler: v1.WoocommerceCheckoutImages.show,
    options: {
      auth: "jwt",
    }
  })

  server.route({
    method: "PUT",
    path: "/v1/woocommerce/checkout_image",
    handler: v1.WoocommerceCheckoutImages.update,
    options: {
      auth: "jwt",
      validate: {
        payload: Joi.object({
          name: Joi.string()
        })
      }
    }
  })

  server.route({
    method: "GET",
    path: "/v1/woocommerce/accounts/{account_id}/checkout_image.png",
    handler: v1.WoocommerceCheckoutImages.image
  });



}
