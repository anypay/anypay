'use strict';

const Hapi=require('hapi');
require('dotenv').config() 

// Create a server with a host and port
const server=Hapi.server({
    host:'0.0.0.0',
    port:process.env.PORT || 8000,
		routes: {
			cors: true
		}
});

const dashTotals = require('./lib/dash/totals')
const dashAddress = require('./lib/dash/address')

// Add the route
server.route({
    method:'GET',
    path:'/api/dash',
    handler: async function(request,h) {
				let totalAvailable = await dashTotals.getTotalAvailable();
				let totalPaid = await dashTotals.getTotalPaid();
				let donationAddress = await dashAddress.getDonationAddress();

				return {
					totalAvailable: totalAvailable,
				  totalPaid: totalPaid,
					donationAddress: donationAddress
				}
    }
});

// Start the server
async function start() {

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();
