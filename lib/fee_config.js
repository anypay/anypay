const fs = require('fs');
const feesJson = JSON.parse(fs.readFileSync(__dirname+'/../config/fees.json'));

module.exports.getForCurrency = (currency) => {

  return feesJson['fees'][currency];
}
