/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================

require("dotenv").config()

import { log } from './log';

import { verifyToken } from './jwt'

import { compare } from './bcrypt'
import { Request, ResponseToolkit } from '@hapi/hapi';
import prisma from './prisma';
import AuthenticatedRequest from '../server/auth/AuthenticatedRequest'

import { accounts as Account } from '@prisma/client';
import { config } from './config';

export async function validateSudoPassword(request: Request, username: string, password: string, h: ResponseToolkit) {

  log.info('validate sudo password');

  if (!username) {

    return {

      isValid: false

    }

  }

  try {

    await compare(username, String(config.get('SUDO_PASSWORD_HASH')));

    return {

      isValid: true,

      credentials: {

        admin: true

      }

    }

  } catch(error: any) {

    log.error('auth.sudo.error', error);

    return {

      isValid: false

    }


  }

}



export async function validateToken(request: AuthenticatedRequest, username: string, password: string) {

  if (!username) {
    return {
      isValid: false
    };
  }

  let accessToken = await prisma.access_tokens.findFirst({
    where: {
      uid: username
    }
  });

  if (accessToken) {
    const account = await prisma.accounts.findFirstOrThrow({
      where: {
        id: accessToken.account_id
      }
    })

		request.account = account;

    request.account_id = accessToken.account_id;

    return {
      isValid: true,
      credentials: { accessToken: accessToken }
    }
  } else {

      return {

        isValid: false

      }

    }

};

export async function authorizeAccount(token: string): Promise<Account> {

  let verified = await verifyToken(token)

  return prisma.accounts.findFirstOrThrow({
    where: {
      id: verified.account_id
    }
  })

}

