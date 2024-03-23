//------------------------------------------------------------------------------
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

import coins from './coins'
import prices from './prices'
import rabbi from './rabbi'
import prometheus from './prometheus'
import plugins from './plugins'

import { Anypay } from '../lib/index'

export async function initialize(anypay: Anypay) {

  console.log('initialize plugins')
  await plugins()

  console.log('initialize coins')
  await coins()

  console.log('initialize prices')
  await prices()

  console.log('initialize rabbi amqp actor system')
  await rabbi()

  console.log('initialize prometheus')
  await prometheus(anypay)

  console.log('initialization complete')
}
