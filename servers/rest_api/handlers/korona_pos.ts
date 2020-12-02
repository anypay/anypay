import * as Boom from 'boom';

export async function post(req, h) {
  console.log('korona pos post')

  console.log('payload')
  console.log(req.payload)
  console.log('query', req.query)

  return { success: true }

}

export async function get(req, h) {
  console.log('korona pos post')

  console.log('payload')
  console.log(req.payload)
  console.log('query', req.query)

  return { success: true }

}
