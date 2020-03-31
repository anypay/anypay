
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


