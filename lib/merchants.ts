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
import { log } from './log'
import prisma from './prisma';

interface MerchantInfo {
  business_address?: string;
  business_name: string;
  latitude: number;
  longitude: number;
  image_url: string;
  account_id: number;
  denomination: string;
}

export async function getMerchantInfo(identifier: any): Promise<MerchantInfo> {

  log.info('merchants.getMerchantInfo', { identifier })

  var account = await prisma.accounts.findFirst({
    where: {
      stub: identifier.toString()
    }
  })

  if (!account) {

    account = await prisma.accounts.findFirstOrThrow({
      where: {
        id: parseInt(identifier)
      }
    })

  }


  return {
    business_name: String(account.business_name),
    latitude: parseFloat(String(account.latitude)),
    longitude: parseFloat(String(account.longitude)),
    image_url: String(account.image_url),
    account_id: account.id,
    denomination: String(account.denomination)
  }

}