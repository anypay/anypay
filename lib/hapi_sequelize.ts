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
export interface HapiSequelizeDefaults {
  order?: any,
  limit?: number;
  offset?: number;
}

export function parseRequest(request, defaults: HapiSequelizeDefaults = {}): any {

  let order = parseOrder(request, defaults.order);
  let limit = parseLimit(request, defaults.limit);
  let offset = parseOffset(request, defaults.offset);

  return { order, limit, offset }

};

export function parseOrder(request, defaultOrder=[['createdAt', 'desc']]) {

  if (!request.query || !request.query.orderBy) {
    return defaultOrder;
  }

  let direction = request.query.orderDirection || 'desc';

  return [[request.query.orderBy, direction]];
  
}

export function parseLimit(request, defaultLimit=100) {

  if (!request.query || !request.query.limit) {
    return defaultLimit;
  }

  return parseInt(request.query.limit);

}

export function parseOffset(request, defaultOffset=0) {

  if (!request.query || !request.query.offset) {
    return defaultOffset;
  }

  return parseInt(request.query.offset);

}


