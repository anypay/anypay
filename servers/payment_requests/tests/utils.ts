
import { Server } from '../server'

var server

export { server }

export async function initServer() {

  server = await Server()

}

