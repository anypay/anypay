const DashInvoice = require("../../../lib/dash/invoice");

module.exports.create = async function(request, reply) {

  if (!request.payload || !request.payload.amount) {
    reply({ error: 'amount required (dollars)' });
    return;
  }

  let dollarAmount = request.payload.amount;
  let accountId = request.auth.credentials.accessToken.account_id;

  console.log('dash invoice generate!!!')

  try {
    var invoice = await DashInvoice.generate(dollarAmount, accountId);
  } catch(error) {
    return { error: error.message };
  }

  return invoice;
}

