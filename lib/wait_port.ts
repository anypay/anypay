#!/usr/bin/env ts-node
require('dotenv').config()

const waitPort = require('wait-port');

const url = require('url');

import { log } from './log';

export async function waitForDatabase() {

	const unparsed = process.env.DATABASE_URL || process.env.DEV_DATABASE_URL

	let { hostname: host, port } = url.parse(unparsed)

	port = parseInt(port)

	log.info('network.port.wait', { host, port })

	const { open, ipVersion } = await waitPort({ host, port })

	log.info('network.port.connected', { host, port, open, ipVersion })

	return { host, port, open, ipVersion }

}


export async function waitForMessageExchange() {

	const unparsed = process.env.AMQP_URL

	let { hostname: host, port } = url.parse(unparsed)

	port = parseInt(port)

	log.info('network.port.wait', { host, port })

	const { open, ipVersion } = await waitPort({ host, port })

	log.info('network.port.connected', { host, port, open, ipVersion })

	return { host, port, open, ipVersion }
}
