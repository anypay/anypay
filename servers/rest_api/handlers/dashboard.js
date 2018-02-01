
const sequelize=require('../../../lib/database');
    const bitcoinPrice=require('../../../lib/bitcoin/price');
    const bitcoinCashPrice=require('../../../lib/bitcoin_cash/price');
    const dashPrice=require('../../../lib/dash/price');
    const dogecoinPrice=require('../../../lib/dogecoin/price');
    const litecoinPrice=require('../../../lib/litecoin/price');
    module.exports.index=function(request, reply) {
    let currentDate=new Date();
        currentDate.setMonth(currentDate.getMonth()-1);
        let currentMonth=currentDate.getMonth();
        let currentYear=currentDate.getFullYear();
        //let currentDay=currentDate.getDate();
        let currentDay=01;
        let targetDate=currentYear+'-'+currentMonth+'-'+currentDay+'T00:00:00.0Z';
        let accountId=request.auth.credentials.accessToken.account_id;
        var sql='';
        if ([41, 14, 125, 177].indexOf(request.auth.credentials.accessToken.account_id)<0){
    sql=`select*from invoices where "account_id"='`+accountId+`' AND  "createdAt">'`+targetDate+`'`;
    } else{
    sql=`select*from invoices where "createdAt">'`+targetDate+`'`;
    }
    sequelize.query(sql, {
    type: sequelize.QueryTypes.SELECT
    })
        .then(invoices=>{
        reply({ invoices: invoices, targetDate:targetDate, prices:{
        BTC:bitcoinPrice.getDollarPrice(),
            BCH:bitcoinCashPrice.getDollarPrice(),
            DASH:dashPrice.getDollarPrice(),
            DOGE:dogecoinPrice.getDollarPrice(),
            LTC:litecoinPrice.getDollarPrice()}});
        })
        .catch(error=>{
        reply({ error: error.message }).code(500);
        });
    }
