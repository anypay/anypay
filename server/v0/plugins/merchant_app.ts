
import * as Joi from '@hapi/joi'

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
      tags: ['api']
    }
  });

  server.route({
    method: "GET",
    path: "/woocommerce",
    handler: v0.Woocommerce.index,
    options: {
      auth: "token",
      tags: ['api']
    }
  });


  server.route({
    method: "POST",
    path: "/access_tokens",
    handler: v0.AccessTokens.create,
    options: {
      auth: "password",
      tags: ['api'],
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
      tags: ['api']
    }
  });

  server.route({
    method: "POST",
    path: "/invoices",
    handler: v0.Invoices.create,
    options: {
      auth: "token",
      tags: ['api'],
      validate: {
        payload: models.Invoice.Request,
        failAction
      },
      plugins: responsesWithSuccess({ model: models.Invoice.Response }),
    }
  });

  server.route({
    method: "DELETE",
    path: "/invoices/{uid}",
    handler: v0.Invoices.cancel,
    options: {
      auth: "token",
      tags: ['api']
    }
  });


  server.route({
    method: "PUT",
    path: "/addresses/{currency}",
    handler: v0.Addresses.update,
    options: {
      auth: "token",
      tags: ['merchant_app'],
      validate: {
        params: Joi.object({
          currency: Joi.string().required()
        }),
        payload: Joi.object({
          address: Joi.string().required()
        }),
        failAction
      }
    }
  });

  server.route({
    method: "GET",
    path: "/addresses",
    handler: v0.Addresses.list,
    options: {
      auth: "token",
      tags: ['merchant_app'],
      plugins: responsesWithSuccess({ model: v0.Addresses.PayoutAddresses }),
    }
  });

  server.route({
    method: "DELETE",
    path: "/addresses/{currency}",
    handler: v0.Addresses.destroy,
    options: {
      auth: "token",
      tags: ['merchant_app']
    }
  });

  server.route({
    method: "GET",
    path: "/account_addresses",
    handler: v0.Addresses.index,
    options: {
      auth: "token",
      tags: ['merchant_app']
    }
  });

  server.route({
    method: "PUT",
    path: "/addresses/{id}/notes",
    handler: v0.AddressNotes.update,
    options: {
      auth: "token",
      tags: ['merchant_app'],
      validate: {
        params: Joi.object({
          id: Joi.number().required()
        }),
        payload: Joi.object({
          note: Joi.string().required()
        }),
        failAction
      }
    }
  });

  server.route({
    method: "POST",
    path: "/v0/search",
    handler: v0.Search.create,
    options: {
      auth: "token",
      tags: ['merchant_app', 'invoices'],
      validate: {
        payload: Joi.object({
          search: Joi.string().required()
        }),
        failAction
      }
    }
  });
  server.route({
    method: "GET",
    path: "/account",
    handler: v0.Accounts.show,
    options: {
      auth: "token",
      tags: ['merchant_app'],
      plugins: responsesWithSuccess({ model: models.Account.Response }),
    }
  });

  server.route({
    method: "PUT",
    path: "/account",
    handler: v0.Accounts.update,
    options: {
      auth: "token",
      tags: ['merchant_app']
    }
  });

  server.route({
    method: "GET",
    path: "/coins",
    handler: v0.Coins.list,
    options: {
      tags: ['merchant_app'],
      auth: "token",
      plugins: responsesWithSuccess({ model: v0.Coins.CoinsIndexResponse }),
    }
  });

  server.route({
    method: "POST",
    path: "/password-resets",
    handler: v0.Passwords.reset,
    options: {
      tags: ['merchant_app'],
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
      tags: ['merchant_app'],
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
      tags: ['merchant_app'],
      auth: "token"
    }
  });

  server.route({
    method: "GET",
    path: "/settings/denomination",
    handler: v0.Denominations.show,
    options: {
      tags: ['merchant_app'],
      auth: "token"
    }
  });

  server.route({
    method: "POST",
    path: "/firebase_token",
    options: {
      auth: "token",
      tags: ['firebase', 'merchant_app'],
      handler: v0.FirebaseTokens.create
    }
  });

  server.route({
    method: "PUT",
    path: "/firebase_token",
    options: {
      auth: "token",
      tags: ['firebase', 'merchant_app'],
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
      tags: ['merchant_app']
    }
  });


  server.route({
    method: "POST",
    path: "/invoices/{uid}/share/email",
    handler: v0.Invoices.shareEmail,
    options: {
      tags: ['merchant_app'],
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
      auth: "token",
      tags: ['merchant_app', 'grab_and_go']
    }
  });

  server.route({
    method: "POST",
    path: "/accounts",
    handler: v0.Accounts.create,
    options: {
      tags: ['merchant_app'],
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
      auth: "token"
    }
  }); 

  server.route({
    method: 'POST',
    path: '/bittrex_api_keys',
    handler: v0.BittrexApiKeys.create,
    options: {
      auth: "token"
    }
  }); 

  server.route({
    method: 'GET',
    path: '/bittrex_api_keys',
    handler: v0.BittrexApiKeys.show,
    options: {
      auth: "token"
    }
  }); 

  server.route({
    method: 'DELETE',
    path: '/bittrex_api_keys',
    handler: v0.BittrexApiKeys.destroy,
    options: {
      auth: "token"
    }
  }); 

  server.route({
    method: 'POST',
    path: '/kraken_api_keys',
    handler: v0.KrakenApiKeys.create,
    options: {
      auth: "token"
    }
  }); 

  server.route({
    method: 'GET',
    path: '/kraken_api_keys',
    handler: v0.KrakenApiKeys.show,
    options: {
      auth: "token"
    }
  }); 

  server.route({
    method: 'DELETE',
    path: '/kraken_api_keys',
    handler: v0.KrakenApiKeys.destroy,
    options: {
      auth: "token"
    }
  }); 



  return server

}

