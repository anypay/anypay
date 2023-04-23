
import * as Joi from 'joi'

import { models } from '../../../lib'

import { Server } from '@hapi/hapi'

import { v0, failAction } from '../../handlers'

import { responsesWithSuccess } from '../../swagger'

export async function register(server: Server) {

  server.route({
    method: "GET",
    path: "/invoices",
    handler: v0.Invoices.index,
    options: {
      auth: "token",
      tags: ['api', 'v0', 'invoices']
    }
  });

  server.route({
    method: "GET",
    path: "/woocommerce",
    handler: v0.Woocommerce.index,
    options: {
      auth: "token",
      tags: ['v0', 'wordpress']
    }
  });


  server.route({
    method: "POST",
    path: "/access_tokens",
    handler: v0.AccessTokens.create,
    options: {
      auth: "password",
      tags: ['v0', 'sessions'],
      plugins: responsesWithSuccess({ model: models.AccessToken.Response })
    }
  });

  server.route({
    method: "POST",
    path: "/invoices/{invoice_uid}/notes",
    handler: v0.InvoiceNotes.create,
    options: {
      validate: {
        payload: Joi.object({
          note: Joi.string().required()
        }),
        failAction
      },
      auth: "token",
      tags: ['v0', 'invoices']
    }
  });

  server.route({
    method: "POST",
    path: "/invoices",
    handler: v0.Invoices.create,
    options: {
      auth: "token",
      tags: ['api', 'v0', 'invoices'],
      validate: {
        payload:  Joi.object({
          amount: Joi.number().required(),
          currency: Joi.string().optional(),
          redirect_url: Joi.string().optional().allow(''),
          webhook_url: Joi.string().optional().allow(''),
          wordpress_site_url: Joi.string().optional().allow(''),
          memo: Joi.string().optional().allow(''),
          email: Joi.string().optional().allow(''),
          external_id: Joi.string().optional().allow(''),
          business_id: Joi.string().optional().allow(''),
          location_id: Joi.string().optional().allow(''),
          register_id: Joi.string().optional().allow(''),
          required_fee_rate: Joi.string().allow(
            'fastestFee',
            'halfHourFee',
            'hourFee',
            'economyFee',
            'minimumFee'
          ).optional()
        }).label('InvoiceRequest'),
        failAction: 'log'
      },
      response: {
        failAction: 'log',
        schema: Joi.object({
          invoice: Joi.object({
            uid: Joi.string().required(),
            uri: Joi.string().required(),
            status: Joi.string().required(),
            currency: Joi.string().required(),
            amount: Joi.number().required(),
            hash: Joi.string().optional(),
            payment_options: Joi.array().items(Joi.object({
              time: Joi.string().optional(),
              expires: Joi.string().required(),
              memo: Joi.string().optional(),
              paymentUrl: Joi.string().required(),
              paymentId: Joi.string().required(),
              chain: Joi.string().required(),
              currency: Joi.string().required(),
              network: Joi.string().required(),
              instructions: Joi.array().items(Joi.object({
                type: Joi.string().optional(),
                requiredFeeRate: Joi.number().optional(),
                outputs: Joi.array().items(Joi.object({
                  address: Joi.string(),
                  script: Joi.string(),
                  amount: Joi.number().required() 
                }).or('address', 'script').required()),
              })).required(),
            })).required(),
            notes: Joi.array().optional()
          }).required()
        }).required()
      }
    }
  });

  server.route({
    method: "DELETE",
    path: "/invoices/{uid}",
    handler: v0.Invoices.cancel,
    options: {
      auth: "token",
      tags: ['api', 'v0', 'invoices']
    }
  });


  server.route({
    method: "PUT",
    path: "/addresses/{currency}",
    handler: v0.Addresses.update,
    options: {
      auth: "token",
      tags: ['v0', 'addresses'],
      validate: {
        params: Joi.object({
          currency: Joi.string().required()
        }),
        payload: Joi.object({
          address: Joi.string().required()
        }),
        failAction: 'log'
      }
    }
  });

  server.route({
    method: "GET",
    path: "/addresses",
    handler: v0.Addresses.list,
    options: {
      auth: "token",
      tags: ['v0', 'addresses'],
      plugins: responsesWithSuccess({ model: v0.Addresses.PayoutAddresses }),
    }
  });

  server.route({
    method: "DELETE",
    path: "/addresses/{currency}",
    handler: v0.Addresses.destroy,
    options: {
      auth: "token",
      tags: ['v0', 'addresses']
    }
  });

  server.route({
    method: "GET",
    path: "/account_addresses",
    handler: v0.Addresses.index,
    options: {
      auth: "token",
      tags: ['v0', 'addresses']
    }
  });

  server.route({
    method: "PUT",
    path: "/addresses/{id}/notes",
    handler: v0.AddressNotes.update,
    options: {
      auth: "token",
      tags: ['v0', 'addresses'],
      validate: {
        params: Joi.object({
          id: Joi.number().required()
        }),
        payload: Joi.object({
          note: Joi.string().required()
        }),
        failAction: 'log'
      }
    }
  });

  server.route({
    method: "POST",
    path: "/v0/search",
    handler: v0.Search.create,
    options: {
      auth: "token",
      tags: ['v0', 'search'],
      validate: {
        payload: Joi.object({
          search: Joi.string().required()
        }),
        failAction: 'log'
      }
    }
  });
  server.route({
    method: "GET",
    path: "/account",
    handler: v0.Accounts.show,
    options: {
      auth: "token",
      tags: ['v0', 'accounts'],
      plugins: responsesWithSuccess({ model: models.Account.Response }),
    }
  });

  server.route({
    method: "PUT",
    path: "/account",
    handler: v0.Accounts.update,
    options: {
      auth: "token",
      tags: ['v0', 'accounts'],
    }
  });

  server.route({
    method: "GET",
    path: "/coins",
    handler: v0.Coins.list,
    options: {
      tags: ['v0', 'coins'],
      auth: "token",
      plugins: responsesWithSuccess({ model: v0.Coins.CoinsIndexResponse }),
    }
  });

  server.route({
    method: "POST",
    path: "/password-resets",
    handler: v0.Passwords.reset,
    options: {
      tags: ['v0', 'accounts'],
      validate: {
        payload: v0.Passwords.PasswordReset,
        failAction
      },
      plugins: responsesWithSuccess({ model: v0.Passwords.Success }),
    }
  });

  server.route({
    method: "POST",
    path: "/password-resets/{uid}",
    handler: v0.Passwords.claim,
    options: {
      tags: ['v0', 'accounts'],
      validate: {
        payload: v0.Passwords.PasswordResetClaim,
        failAction
      },
      plugins: responsesWithSuccess({ model: v0.Passwords.Success }),
    }
  });

  server.route({
    method: "PUT",
    path: "/settings/denomination",
    handler: v0.Denominations.update,
    options: {
      tags: ['v0', 'accounts'],
      auth: "token"
    }
  });

  server.route({
    method: "GET",
    path: "/settings/denomination",
    handler: v0.Denominations.show,
    options: {
      tags: ['v0', 'accounts'],
      auth: "token"
    }
  });

  server.route({
    method: "POST",
    path: "/firebase_token",
    options: {
      auth: "token",
      tags: ['v0', 'firebase'],
      handler: v0.FirebaseTokens.create
    }
  });

  server.route({
    method: "PUT",
    path: "/firebase_token",
    options: {
      auth: "token",
      tags: ['v0', 'firebase'],
      handler: v0.FirebaseTokens.update
    }
  });

  server.route({
    method: 'GET',
    path: '/support/{token}',
    handler: v0.SupportProxy.show,
    options: {
      tags: ['merchant_app'],
    }
  }); 

  server.route({
    method: "GET",
    path: "/invoices/{invoice_uid}/payment_options",
    handler: v0.InvoicePaymentOptions.show,
    options: {
      tags: ['v0', 'invoices']
    }
  });


  server.route({
    method: "POST",
    path: "/invoices/{uid}/share/email",
    handler: v0.Invoices.shareEmail,
    options: {
      tags: ['v0', 'invoices'],
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required()
        }),
        failAction
      }
    }
  });

  server.route({
    method: "GET",
    path: "/grab_and_go_items",
    handler: v0.Products.index,
    options: {
      tags: ['v0', 'grab-and-go']
    }
  });

  server.route({
    method: "POST",
    path: "/accounts",
    handler: v0.Accounts.create,
    options: {
      tags: ['v0', 'accounts'],
      validate: {
        payload: models.Account.Credentials,
        failAction
      },
      plugins: responsesWithSuccess({ model: models.Account.Response }),
    },
  });

  server.route({
    method: 'GET',
    path: '/api_keys',
    handler: v0.ApiKeys.index,
    options: {
      tags: ['v0', 'api-keys'],
      auth: "token"
    }
  }); 

  server.route({
    method: 'POST',
    path: '/bittrex_api_keys',
    handler: v0.BittrexApiKeys.create,
    options: {
      tags: ['v0', 'bittrex'],
      auth: "token"
    }
  }); 

  server.route({
    method: 'GET',
    path: '/bittrex_api_keys',
    handler: v0.BittrexApiKeys.show,
    options: {
      tags: ['v0', 'bittrex'],
      auth: "token"
    }
  }); 

  server.route({
    method: 'DELETE',
    path: '/bittrex_api_keys',
    handler: v0.BittrexApiKeys.destroy,
    options: {
      tags: ['v0', 'bittrex'],
      auth: "token"
    }
  }); 

  server.route({
    method: 'POST',
    path: '/kraken_api_keys',
    handler: v0.KrakenApiKeys.create,
    options: {
      tags: ['v0', 'kraken'],
      auth: "token"
    }
  }); 

  server.route({
    method: 'GET',
    path: '/kraken_api_keys',
    handler: v0.KrakenApiKeys.show,
    options: {
      tags: ['v0', 'kraken'],
      auth: "token"
    }
  }); 

  server.route({
    method: 'DELETE',
    path: '/kraken_api_keys',
    handler: v0.KrakenApiKeys.destroy,
    options: {
      tags: ['v0', 'kraken'],
      auth: "token"
    }
  }); 

  return server

}

