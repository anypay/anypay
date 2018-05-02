const Invoice = require('../../../lib/models/invoice');
const sequelize = require('../../../lib/database');
const Joi = require('joi');

module.exports.index = function(request, reply) {
  let accountId = 14;
  let currentDate = new Date();
  let currentYear = currentDate.getFullYear();
  let currentMonth = currentDate.getMonth() + 1;
  let currentDay = currentDate.getDate() + 1;
  let targetDate = currentYear + '-' + currentMonth + '-' + currentDay + 'T00:00:00.0Z';
  sequelize.query(`select*
                        from invoices
                        where "createdAt">'` + targetDate + `'
                        `, {
      type: sequelize.QueryTypes.SELECT
    })
    .then(invoices => {
      reply({
        invoices: invoices,
        targetDate: targetDate
      });
    })
    .catch(error => {
      reply({
        error: error.message
      }).code(500);
    });
}

module.exports.IndexResponse = Joi.object({
    invoices: Joi.array().items(Invoice.Response).required().label('Invoices'),
    targetDate: Joi.date(),
}).label('InvoiceIndexResponse');
