
const http = require("superagent");

const COINMARKETCAP_URL = "http://api.coinmarketcap.com/v1/ticker/ETHEREUM/";

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

async function updatePrice() {

  var price = await getDollarPrice()

  dollarPrice = price;
}

setInterval(async () => {
  await updatePrice();
}, 1000 * 60); // once per minute

(async function() {

  await updatePrice()

})();


module.exports.convertDollarsToEther = async (dollars) => {

  if (!dollarPrice) {
    await updatePrice()
  }

  return dollars / dollarPrice;
}

