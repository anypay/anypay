
const http = require("superagent");

const COINMARKETCAP_URL = "http://api.coinmarketcap.com/v1/ticker/ZCASH"

let dollarPrice;

function getDollarPrice() {
  return new Promise((resolve, reject) => {

    http
      .get(COINMARKETCAP_URL)
      .end((error, response) => {
        try {
          let price = parseFloat(response.body[0]["price_usd"]);
          resolve(price);
        } catch(error) {
          reject("coinmarketcap error");
        }
      });
  });
}

function updatePrice() {

  getDollarPrice()
    .then(price => {
      dollarPrice = price;
    })
    .catch(console.error);
}

setInterval(updatePrice, 1000 * 60); // once per minute

updatePrice();

module.exports.convertDollarsToZcash = (dollars) => {

  return dollars / dollarPrice;
}

