
const sequelize=require('../../../lib/database');
        const bitcoinPrice=require('../../../lib/bitcoin/price');
        const bitcoinCashPrice=require('../../../lib/bitcoin_cash/price');
        const dashPrice=require('../../../lib/dash/price');
        const dogecoinPrice=require('../../../lib/dogecoin/price');
        const litecoinPrice=require('../../../lib/litecoin/price');
        /**
         * @api {get} /coins Request User Supported Coins
         * @apiName GetCoins
         * @apiGroup Coin
         *
         * @apiError AccountNotFound No Account was found with access_token provided
         *
         * @apiSuccess {String} code Currency code of the coin
         * @apiSuccess {String} name Display name of currency in English
         * @apiSuccess {Boolean} enabled false if account support for coin is disabled
         *
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "coins": [{
         *         "code": "BTC",
         *         "name": "bitcoin",
         *         "enabled": false
         *       },{
         *        "code": "DASH",
         *        "name": "dash",
         *        "enabled": true
         *       }]
         *     }
         */

        module.exports.index=function(request, reply) {
        //let accountId=14;
        let currentDate=new Date();
                let currentYear=currentDate.getFullYear();
                //let currentMonth=currentDate.getMonth()+1;
                //let currentDay=currentDate.getDate();
                let currentMonth=11;
                let currentDay=25;
                let targetDate=currentYear+'-'+currentMonth+'-'+currentDay+'T00:00:00.0Z';
                sequelize.query(`select*
                        from invoices
                        where "createdAt">'`+targetDate+`'
                        `, {
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
