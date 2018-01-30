
export const paymentSchema = {
  'id': '/Payment',
  'type': 'object',
  'properties': {
    'hash': { 'type': 'string'},
    'amount': { 'type': 'number' },
    'currency': { 'type': 'string' },
    'address': {'type': 'string'}
  }
}

