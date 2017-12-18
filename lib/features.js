
const flipit = require('flipit');

let bcash = process.env.ANYPAY_FEATURE_BITCOINCASH

if (bcash === '1' || bcash === 'true') {
  flipit.enable('BITCOINCASH');
}

module.exports = flipit;

