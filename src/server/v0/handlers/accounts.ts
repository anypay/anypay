const Boom = require('boom');
var geoip = require('geoip-lite');

import moment from 'moment'

import { coins, accounts, log, utils } from '@/lib';

import { Request, ResponseToolkit } from '@hapi/hapi';
import prisma from '@/lib/prisma';
import { badRequest } from '@hapi/boom';

import AuthenticatedRequest from '@/server/auth/AuthenticatedRequest';


export async function update(request: AuthenticatedRequest | Request, h: ResponseToolkit) {

  try {

    let account = await accounts.updateAccount((request as AuthenticatedRequest).account, request.payload);

    return {

      success: true,

      account

    }

  } catch(error: any) {

    log.error('api.v0.Accounts.update', error)

    return badRequest(error.message)

  }

}

export async function create (request: Request | AuthenticatedRequest, h: ResponseToolkit) {

  const payload = request.payload as {
    email: string,
    password: string
  }

  try {
    let email = payload.email;

    log.debug('create.account', { email });

    let passwordHash = await utils.hash(payload.password);

    let account = await prisma.accounts.findFirst({
      where: {
        email: email
      }
    })

    if (account) {
        
        return Boom.conflict('Account already exists');
    }

    account = await prisma.accounts.create({
      data: {
        email: email,
        password_hash: String(passwordHash),
        registration_ip_address: request.info.remoteAddress,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    
    let geoLocation = geoip.lookup(request.headers['x-forwarded-for'] || request.info.remoteAddress)

    if (geoLocation) {


      await prisma.accounts.update({
        where: {
          id: account.id
        },
        data: {
          registration_geolocation: geoLocation
        }
      
      })

      account = await prisma.accounts.findFirstOrThrow({
        where: {
          id: account.id
        }
      })

    }
    
    return account;

  } catch(error: any) {

    log.error('api.v0.Accounts.create', error)

    return badRequest(error.message)

  }

}

export async function showPublic (request: Request | AuthenticatedRequest, h: ResponseToolkit) {

  try {

    let account = await prisma.accounts.findFirst({
      where: {
        email: request.params.id
      }
    })

    if (!account) {

      account = await prisma.accounts.findFirst({
        where: {
          id: request.params.id
        }
      })
    }

    if (!account) {

      return Boom.notFound();
    }

    const addresses = await prisma.addresses.findMany({
      where: {
        account_id: account.id
      }
    
    })

    const payments = await prisma.invoices.findMany({
      where: {
        account_id: account.id,
        status: 'paid',
        createdAt: {
          gte: moment().subtract(1, 'month').toDate()
        }
      },

      orderBy: {
        createdAt: 'desc'
      }
    
    })

    let latest = await prisma.invoices.findMany({
      where: {
        account_id: account.id,
        status: 'paid'
      },

      orderBy: {
        createdAt: 'desc'
      }
    })

    return {
      id: account.id,
      name: account.business_name,
      physical_address: account.physical_address,
      coordinates: {
        latitude: account.latitude,
        longitude: account.longitude
      },
      coins: addresses.filter(a => {
        let coin = coins.getCoin(String(a.currency))
        return !!coin && !coin.unavailable
      }).map(a => a.currency),
      payments: {
        last_30_days: payments.length,
        latest: latest
      }

    }

  } catch(error: any) {

    log.error('api.v0.Accounts.showPublic', error)

    return badRequest(error.message)

  }

}



export async function show (request: AuthenticatedRequest | Request, h: ResponseToolkit) {

    try {

    const addresses = await prisma.addresses.findMany({
      where: {
        account_id: (request as AuthenticatedRequest).account.id
      }
    })


    return  {
      addresses
    }
    
  } catch(error: any) {

    log.error('api.v0.Accounts.show', error)

    return badRequest(error.message)

  }
};

export async function index(request: Request | AuthenticatedRequest, h: ResponseToolkit) {

  try {

    let limit = parseInt(request.query.limit) || 100;
    
    let offset = parseInt(request.query.offset) || 0;

    const accounts = await prisma.accounts.findMany({
      take: limit,
      skip: offset
    })

    return accounts;

  } catch(error: any) {

    log.error('api.v0.Accounts.nearby', error)

    return badRequest(error.message)

  }

};
