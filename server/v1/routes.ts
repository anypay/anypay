require('dotenv').config()

import { Server } from '@hapi/hapi';
import { v1, failAction } from '../handlers'

import * as Joi from 'joi'

export async function attachV1Routes(server: Server) {

  server.route({
    method: "POST",
    path: "/v1/api/account/register",
    handler: v1.AccountRegistrations.create,
    options: {
      tags: ['v1', 'accounts'],
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().required()
        }).required(),
        failAction
      }
    },
  });

  server.route({
    method: "POST",
    path: "/v1/api/account/login",
    handler: v1.AccountLogins.create,
    options: {
      tags: ['v1', 'sessions'],
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
      tags: ['v1', 'accounts'],
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
      tags: ['v1', 'accounts'],
      auth: "jwt"
    },
    handler: v1.MyAccount.show
  });

  server.route({
    method: "GET",
    path: "/v1/api/account/access-keys",
    options: {
      tags: ['v1', 'sessions'],
      auth: "jwt"
    },
    handler: v1.AccessKeys.index
  });

  server.route({
    method: 'GET',
    path: '/v1/api/webhooks',
    options: {
      tags: ['v1', 'webhooks'],
      auth: "jwt"
    },
    handler: v1.Webhooks.index
  }); 

  server.route({
    method: 'GET',
    path: '/v1/api/account/payments',
    options: {
      tags: ['v1', 'payments'],
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
    method: 'GET',
    path: '/v1/api/linked-accounts',
    options: {
      tags: ['v1', 'accounts'],
      auth: "jwt",
      validate: {
        query: Joi.object({
          limit: Joi.number().optional(),
          offset: Joi.number().optional()
        }),
        failAction
      }
    },
    handler: v1.LinkedAccounts.index
  });

  server.route({
    method: 'POST',
    path: '/v1/api/linked-accounts',
    options: {
      tags: ['v1', 'linked-accounts'],
      auth: "jwt",
      validate: {
        payload: Joi.object({
          email: Joi.string().optional()
        }),
        failAction
      }
    },
    handler: v1.LinkedAccounts.create
  });

  server.route({
    method: 'DELETE',
    path: '/v1/api/linked-accounts/{id}',
    options: {
      tags: ['v1', 'linked-accounts'],
      auth: "jwt",
      validate: {
        query: Joi.object({
          limit: Joi.number().optional(),
          offset: Joi.number().optional()
        }),
        failAction
      }
    },
    handler: v1.LinkedAccounts.unlink
  }); 

  server.route({
    method: 'GET',
    path: '/v1/api/linked-accounts/{account_id}/payments',
    options: {
      tags: ['v1', 'linked-accounts'],
      auth: "jwt",
      validate: {
        params: Joi.object({
          account_id: Joi.number().required()
        }),
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
    handler: v1.LinkedAccountPayments.index
  }); 

  server.route({
    method: 'POST',
    path: '/v1/api/webhooks/{invoice_uid}/attempts',
    options: {
      tags: ['v1', 'webhooks'],
      auth: "jwt"
    },
    handler: v1.Webhooks.attempt
  }); 

  server.route({
    method: "POST",
    path: "/v1/api/invoices",
    handler: v1.Invoices.create,
    options: {
      tags: ['v1', 'invoices'],
      auth: "jwt",
      validate: {
        payload:  Joi.object({
          amount: Joi.number().required(),
          currency: Joi.string().optional(),
          redirect_url: Joi.string().optional(),
          webhook_url: Joi.string().optional(),
          wordpress_site_url: Joi.string().optional(),
          memo: Joi.string().optional(),
          email: Joi.string().optional(),
          external_id: Joi.string().optional(),
          business_id: Joi.string().optional(),
          location_id: Joi.string().optional(),
          register_id: Joi.string().optional(),
          metadata: Joi.object().optional(),
          required_fee_rate: Joi.string().allow(
            'fastestFee',
            'halfHourFee',
            'hourFee',
            'economyFee',
            'minimumFee'
          ).optional()
        }).label('InvoiceRequest'),
        failAction
      }
    }
  });

  server.route({
    method: "GET",
    path: "/v1/api/invoices/{invoice_uid}",
    handler: v1.Invoices.show,
    options: {
      tags: ['v1', 'invoices'],
      auth: "jwt",
      validate: {
        failAction
      }
    },
  });

  server.route({
    method: "GET",
    path: "/v1/api/invoices/{invoice_uid}/payment",
    handler: v1.Payments.show,
    options: {
      tags: ['v1', 'payments'],
      auth: "jwt",
      validate: {
        failAction
      }
    },
  });


  server.route({
    method: "GET",
    path: "/v1/api/invoices/{invoice_uid}/events",
    handler: v1.InvoiceEvents.index,
    options: {
      tags: ['v1', 'invoices'],
      auth: 'jwt',
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
            app_id: Joi.any().optional(),
            account_id: Joi.any().optional(),
            invoice_uid: Joi.string().optional(),
            type: Joi.string().required(),
            payload: Joi.object().optional(),
            createdAt: Joi.date().required(),
            updatedAt: Joi.date().required(),
            namespace: Joi.string().optional()
          }))
        }),
        failAction
      }
    }
  });
  server.route({
    method: "GET",
    path: "/api/v1/invoices/{invoice_uid}/events",
    handler: v1.InvoiceEvents.index,
    options: {
      tags: ['v1', 'invoices'],
      auth: 'jwt',
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
            app_id: Joi.any().optional(),
            account_id: Joi.any().optional(),
            invoice_uid: Joi.string().optional(),
            type: Joi.string().required(),
            payload: Joi.object().optional(),
            createdAt: Joi.date().required(),
            updatedAt: Joi.date().required(),
            namespace: Joi.string().optional()
          }))
        }),
        failAction
      }
    }  });

  server.route({
    method: "GET",
    path: "/v1/api/account/events",
    handler: v1.AccountEvents.index,
    options: {
      tags: ['v1', 'events'],
      auth: "jwt",
      response: {
        failAction,
        schema: Joi.object({
          account_id: Joi.number().required(),
          events: Joi.array().items(Joi.object({
            id: Joi.number().required(),
            invoice_uid: Joi.any().optional(),
            account_id: Joi.number().optional(),
            type: Joi.string().required(),
            payload: Joi.object().optional(),
            createdAt: Joi.date().required(),
            updatedAt: Joi.date().required(),
            namespace: Joi.string().optional()
          }))
        })
      }
    },
  });

  server.route({
    method: 'POST',
    path: '/v1/api/account/addresses',
    options: {
      tags: ['v1', 'addresses'],
      auth: "jwt",
      validate: {
        payload: Joi.object({
          chain: Joi.string().required(),
          currency: Joi.string().required(),
          value: Joi.string().required(),
          label: Joi.string().optional()
        }),
        failAction: 'log'
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
    path: '/v1/api/account/addresses/{code}',
    options: {
      tags: ['v1', 'addresses'],
      auth: "jwt",
      validate: {
        params: Joi.object({
          code: Joi.string().required()
        }),
        failAction
      },
      response: {
        failAction,
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
    path: '/api/v1/addresses',
    options: {
      tags: ['v1', 'addresses'],
      auth: "token",
      response: {
        failAction: 'log',
        schema: Joi.object({
          addresses: Joi.array().items(Joi.object({
            currency: Joi.string().required(),
            chain: Joi.string().required(),
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
    path: '/v1/api/account/addresses',
    options: {
      tags: ['v1', 'addresses'],
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
      tags: ['v1', 'system'],
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
    handler: v1.Webhooks.test,
    options: {
      tags: ['v1', 'test'],
    }
  }); 

  server.route({
    method: 'POST',
    path: '/v1/api/fail',
    handler: (req, h) => { return h.response().code(400) },
    options: {
      tags: ['v1', 'test'],
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
    options: {
      tags: ['v1', 'wordpress']
    }
  })

  server.route({
    method: "GET",
    path: "/v1/woocommerce/checkout_image",
    handler: v1.WoocommerceCheckoutImages.show,
    options: {
      auth: "jwt",
      tags: ['v1', 'wordpress'],
    }
  })

  server.route({
    method: "PUT",
    path: "/v1/woocommerce/checkout_image",
    handler: v1.WoocommerceCheckoutImages.update,
    options: {
      tags: ['v1', 'wordpress'],
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
    handler: v1.WoocommerceCheckoutImages.image,
    options: {
      tags: ['v1', 'wordpress']
    },
  });

  server.route({
    method: "POST",
    path: "/v1/api/search",
    handler: v1.Search.create,
    options: {
      auth: "jwt",
      tags: ['v1', 'search'],
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
    path: "/v1/api/account/invoices/{invoice_uid}/refund",
    handler: v1.Refunds.show,
    options: {
      auth: "jwt",
      tags: ['v1', 'refunds'],
      validate: {
        params: Joi.object({
          invoice_uid: Joi.string().required()
        })
      },
      /*response: {
        schema: Joi.object({
          invoice_uid: Joi.string().required(),
          currency: Joi.string().required(),
          value: Joi.string().required()
        }),
        //failAction
      }*/
    }
  });


  server.route({
    method: "POST",
    path: "/v1/api/transactions",
    handler: v1.Transactions.create,
    options: {
      tags: ['v1', 'transactions'],
      validate: {
        payload: Joi.object({
          chain: Joi.string().required(),
          transaction: Joi.string().required()
        }),
        failAction
      }
    },
  });

  server.route({
    method: 'POST',
    path: '/api/v1/blockcypher/webhooks',
    handler: v1.BlockcypherWebhooks.create,
    options: {
      tags: ['v1', 'blockcypher', 'webhooks']
    },
  })

  server.route({
    method: 'GET',
    path: '/api/v1/prices',
    handler: v1.Prices.index,
    options: {
      tags: ['v1', 'api', 'prices'],
      response: {
        schema: Joi.object({
          prices: Joi.array().items(Joi.object({
            currency: Joi.string().required(),
            base: Joi.string().required(),
            value: Joi.number().required(),
            updatedAt: Joi.date().required(),
            source: Joi.string().required() 
          }).label('Price')).label('Prices')
        }),
        failAction
      }
    },
  })

  server.route({
    method: 'GET',
    path: '/api/v1/prices/{currency}/history',
    handler: v1.Prices.show,
    options: {
      tags: ['v1', 'prices'],
      response: {
        schema: Joi.object({
        }),
        failAction
      }
    },
  })



}
