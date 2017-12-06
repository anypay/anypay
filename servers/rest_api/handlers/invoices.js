const Invoice=require('../../../lib/models/invoice');
        module.exports.index=(request, reply)=>{

Invoice.findAll({ where: {
account_id: request.auth.credentials.accessToken.account_id
}})
        .then(invoices=>{
        reply({ invoices: invoices });
        });
        }

