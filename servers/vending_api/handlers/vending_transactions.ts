import {models,log} from '../../../lib';

const { Op } = require('sequelize')

import * as moment from 'moment';

import * as sequelize from 'sequelize';

export async function getAccountTransactions(request, h) {

  let accountId = request.auth.credentials.accessToken.account_id;

  let vending_transactions = await models.VendingTransaction.findAll({
      where : { 'account_id' : accountId},
      order: [ [ 'terminal_time', 'DESC' ]],
      include:[{
        model: models.VendingTransactionOutput,
        as: 'outputs'
      }]
  });

  return { vending_transactions }

}

export async function getLatestTransactions(request, h) {

  let vending_transactions = await models.VendingTransaction.findAll({
    limit: 100,
    order: [ [ 'server_time', 'DESC' ]],
    include:[{
        model: models.VendingTransactionOutput,
        as: 'outputs'
    }]
  });

  return {vending_transactions};

}

export async function getMachineTransactions(request, h) {

  let vending_transactions = await models.VendingTransaction.findAll({
    where : { 'terminal_id' : request.params.serial_number},
    order: [ [ 'terminal_time', 'DESC' ]]       
  });

  return {vending_transactions}

}

export async function getRevenue(request, h) {

  let last24Buy = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.gte]: moment().subtract(24, 'hours').toDate()
      },
      type : 'BUY'
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']],
  })

  let last24Sell = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.gte]: moment().subtract(24, 'hours').toDate()
      },
      type : 'SELL',
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']]
  })

  let currentWeekBuy = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().startOf('week'), moment().endOf('week')]
      },
      type : 'BUY',
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']]
  })

  let currentWeekSell = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().startOf('week'), moment().endOf('week')]
      },
      type : 'SELL',
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']]
  })


 let lastWeekBuy = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().subtract('1', 'week').startOf('week'), moment().subtract('1', 'week').endOf('week')]
      },
      type : 'BUY',
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']]
  })

  let lastWeekSell = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().subtract('1', 'week').startOf('week'), moment().subtract('1','week').endOf('week')]
      },
      type : 'SELL',
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']]
  })


let lastMonthBuy = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().subtract('1', 'month').startOf('month'), moment().subtract('1', 'month').endOf('month')]
      },
      type : 'BUY',
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']]
  })

  let lastMonthSell = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().subtract('1', 'month').startOf('month'), moment().subtract('1','month').endOf('month')]
      },
      type : 'SELL',
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']]
  })

 let currentMonthBuy = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().startOf('month'), moment().endOf('month')]
      },
      type : 'BUY',
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']]
  })

  let currentMonthSell = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().startOf('month'), moment().endOf('month')]
      },
      type : 'SELL',
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']]
  })

  let allTimeBuy = await models.VendingTransaction.findAll({
    where: {
      type : 'BUY',
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']]
  })
        
  let allTimeSell = await models.VendingTransaction.findAll({
    where: {
      type : 'SELL',
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']]
  })

  const revenue = {
    last24 : {
      date: moment().toDate(),
      buy : Number(last24Buy[0].toJSON().total).toFixed(2),
      sell : Number(last24Sell[0].toJSON().total).toFixed(2),
      volume : (Number(last24Sell[0].toJSON().total) + Number(last24Buy[0].toJSON().total)).toFixed(2),
    },
    currentWeek : {
      date: moment().startOf('week').toDate(),
      dateEnd: moment().endOf('week').toDate(),
      buy : Number(currentWeekBuy[0].toJSON().total).toFixed(2),
      sell : Number(currentWeekSell[0].toJSON().total).toFixed(2),
      volume : (Number(currentWeekBuy[0].toJSON().total) + Number(currentWeekSell[0].toJSON().total)).toFixed(2),
    },
    lastWeek : {
      date: moment().startOf('week').subtract('1', 'week').toDate(),
      dateEnd: moment().endOf('week').subtract('1', 'week').toDate(),
      buy : Number(lastWeekBuy[0].toJSON().total).toFixed(2),
      sell : Number(lastWeekSell[0].toJSON().total).toFixed(2),
      volume : (Number(lastWeekBuy[0].toJSON().total) + Number(lastWeekSell[0].toJSON().total)).toFixed(2),
    },
    currentMonth : {
      date: moment().startOf('month').toDate(),
      dateEnd: moment().endOf('month').toDate(),
      buy : Number(currentMonthBuy[0].toJSON().total).toFixed(2),
      sell : Number(currentMonthSell[0].toJSON().total).toFixed(2),
      volume : (Number(currentMonthBuy[0].toJSON().total) + Number(currentMonthSell[0].toJSON().total)).toFixed(2),
    },
    lastMonth : {
      date: moment().startOf('month').subtract('1', 'month').toDate(),
      dateEnd: moment().endOf('month').subtract('1', 'month').toDate(),
      buy : Number(lastMonthBuy[0].toJSON().total).toFixed(2),
      sell : Number(lastMonthSell[0].toJSON().total).toFixed(2),
      volume : (Number(lastMonthBuy[0].toJSON().total) + Number(lastMonthSell[0].toJSON().total)).toFixed(2),
    },
    allTime : {
      date: moment().toDate(),
      buy : Number(allTimeBuy[0].toJSON().total).toFixed(2),
      sell : Number(allTimeSell[0].toJSON().total).toFixed(2),
      volume : (Number(allTimeBuy[0].toJSON().total) + Number(allTimeSell[0].toJSON().total)).toFixed(2),
    }

  }

  return { revenue }
}

export async function getAccountRevenue(request, h) {

  let accountId;

  try{

    accountId = request.auth.credentials.accessToken.account_id;

  }catch(err){
  }

  if( !accountId ){
    accountId = request.params.account_id;
  }

  let last24Buy = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.gte]: moment().subtract(24, 'hours').toDate()
      },
      account_id: accountId,
      type : 'BUY'
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']],
  })

  let last24Sell = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.gte]: moment().subtract(24, 'hours').toDate()
      },
      account_id: accountId,
      type : 'SELL'
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']],
  })

  let currentWeekBuy = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().startOf('week'), moment().endOf('week')]
      },
      account_id: accountId,
      type : 'BUY'
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']],
  })

  let currentWeekSell = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().startOf('week'), moment().endOf('week')]
      },
      account_id: accountId,
      type : 'SELL'
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']],
  })


 let lastWeekBuy = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().startOf('week').subtract('1', 'week'), moment().endOf('week').subtract('1', 'week')]
      },
      account_id: accountId,
       type : 'BUY'
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']],
  })

  let lastWeekSell = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().startOf('week').subtract('1', 'week'), moment().endOf('week').subtract('1','week')]
      },
      account_id: accountId,
      type : 'SELL'
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']],
  })


let lastMonthBuy = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().startOf('month').subtract('1', 'month'), moment().endOf('month').subtract('1', 'month')]
      },
      account_id: accountId,
       type : 'BUY'
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']],
  })

  let lastMonthSell = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().startOf('month').subtract('1', 'month'), moment().endOf('month').subtract('1','month')]
      },
      account_id: accountId,
      type : 'SELL'
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']],
  })

 let currentMonthBuy = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().startOf('month'), moment().endOf('month')]
      },
      account_id: accountId,
      type : 'BUY'
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']],
  })

  let currentMonthSell = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().startOf('month'), moment().endOf('month')]
      },
      account_id: accountId,
      type : 'SELL'
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']],
  })

  let allTimeBuy = await models.VendingTransaction.findAll({
    where: {
      account_id: accountId,
      type : 'BUY'
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']],
  })
        
  let allTimeSell = await models.VendingTransaction.findAll({
    where: {
      account_id: accountId,
      type : 'SELL'
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']],
  })

  const revenue = {
    last24 : {
      date: moment().toDate(),
      buy : Number(last24Buy[0].toJSON().total).toFixed(2),
      sell : Number(last24Sell[0].toJSON().total).toFixed(2),
      volume : (Number(last24Sell[0].toJSON().total) + Number(last24Buy[0].toJSON().total)).toFixed(2),
    },
    currentWeek : {
      date: moment().startOf('week').toDate(),
      dateEnd: moment().endOf('week').toDate(),
      buy : Number(currentWeekBuy[0].toJSON().total).toFixed(2),
      sell : Number(currentWeekSell[0].toJSON().total).toFixed(2),
      volume : (Number(currentWeekBuy[0].toJSON().total) + Number(currentWeekSell[0].toJSON().total)).toFixed(2),
    },
    lastWeek : {
      date: moment().startOf('week').subtract('1', 'week').toDate(),
      dateEnd: moment().endOf('week').subtract('1', 'week').toDate(),
      buy : Number(lastWeekBuy[0].toJSON().total).toFixed(2),
      sell : Number(lastWeekSell[0].toJSON().total).toFixed(2),
      volume : (Number(lastWeekBuy[0].toJSON().total) + Number(lastWeekSell[0].toJSON().total)).toFixed(2),
    },
    currentMonth : {
      date: moment().startOf('month').toDate(),
      dateEnd: moment().endOf('month').toDate(),
      buy : Number(currentMonthBuy[0].toJSON().total).toFixed(2),
      sell : Number(currentMonthSell[0].toJSON().total).toFixed(2),
      volume : (Number(currentMonthBuy[0].toJSON().total) + Number(currentMonthSell[0].toJSON().total)).toFixed(2),
    },
    lastMonth : {
      date: moment().startOf('month').subtract('1', 'month').toDate(),
      dateEnd: moment().endOf('month').subtract('1', 'month').toDate(),
      buy : Number(lastMonthBuy[0].toJSON().total).toFixed(2),
      sell : Number(lastMonthSell[0].toJSON().total).toFixed(2),
      volume : (Number(lastMonthBuy[0].toJSON().total) + Number(lastMonthSell[0].toJSON().total)).toFixed(2),
    },
    allTime : {
      date: moment().toDate(),
      buy : Number(allTimeBuy[0].toJSON().total).toFixed(2),
      sell : Number(allTimeSell[0].toJSON().total).toFixed(2),
      volume : (Number(allTimeBuy[0].toJSON().total) + Number(allTimeSell[0].toJSON().total)).toFixed(2),
    }

  }

  return { revenue }
}

export async function getProfit(request, h) {

  let last24 = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.gte]: moment().subtract(24, 'hours').toDate()
      },
    },
    attributes: [[sequelize.fn('sum', sequelize.col('expected_profit_value')), 'total']],
  })

  let currentWeek = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().startOf('week'), moment().endOf('week')]
      },
    },
    attributes: [[sequelize.fn('sum', sequelize.col('expected_profit_value')), 'total']],
  })

  let lastWeek = await models.VendingTransaction.findAll({
    where: {
      server_time: {
       [Op.between]: [moment().startOf('week').subtract('1', 'week'), moment().endOf('week').subtract('1','week')]
      },
    },
    attributes: [[sequelize.fn('sum', sequelize.col('expected_profit_value')), 'total']],
  })

  let lastMonth = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().startOf('month').subtract('1', 'month'), moment().endOf('month').subtract('1','month')]
      },
    },
    attributes: [[sequelize.fn('sum', sequelize.col('expected_profit_value')), 'total']],
  })

  let currentMonth = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().startOf('month'), moment().endOf('month')]
      },
    },
    attributes: [[sequelize.fn('sum', sequelize.col('expected_profit_value')), 'total']],
  })
       
  let allTime = await models.VendingTransaction.findAll({
    attributes: [[sequelize.fn('sum', sequelize.col('expected_profit_value')), 'total']],
  })

  const profit = {
    last24 : {
      date: moment().toDate(),
      value : Number(last24[0].toJSON().total).toFixed(2),
    },
    currentWeek : {
      date: moment().startOf('week').toDate(),
      dateEnd: moment().endOf('week').toDate(),
      value : Number(currentWeek[0].toJSON().total).toFixed(2),
    },
    lastWeek : {
      date: moment().startOf('week').subtract('1', 'week').toDate(),
      dateEnd: moment().endOf('week').subtract('1', 'week').toDate(),
      value : Number(lastWeek[0].toJSON().total).toFixed(2),
    },
    currentMonth : {
      date: moment().startOf('month').toDate(),
      dateEnd: moment().endOf('month').toDate(),
      value : Number(currentMonth[0].toJSON().total).toFixed(2),
    },
    lastMonth : {
      date: moment().startOf('month').subtract('1', 'month').toDate(),
      dateEnd: moment().endOf('month').subtract('1', 'month').toDate(),
      value : Number(lastMonth[0].toJSON().total).toFixed(2),
    },
    allTime : {
      date: moment().toDate(),
      value : Number(allTime[0].toJSON().total).toFixed(2),
    }

  }

  return { profit }
}

export async function getAccountProfit(request, h) {


  let accountId;

  try{

    accountId = request.auth.credentials.accessToken.account_id;

  }catch(err){
  }

  if( !accountId ){
    accountId = request.params.account_id;
  }

  let last24 = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.gte]: moment().subtract(24, 'hours').toDate()
      },
      account_id: accountId
    },
    attributes: [[sequelize.fn('sum', sequelize.col('expected_profit_value')), 'total']],
  })

  let currentWeek = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().startOf('week'), moment().endOf('week')]
      },
      account_id: accountId
    },
    attributes: [[sequelize.fn('sum', sequelize.col('expected_profit_value')), 'total']],
  })

  let lastWeek = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().startOf('week').subtract('1', 'week'), moment().endOf('week').subtract('1','week')]
      },
      account_id: accountId
    },
    attributes: [[sequelize.fn('sum', sequelize.col('expected_profit_value')), 'total']],
  })

  let lastMonth = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().startOf('month').subtract('1', 'month'), moment().endOf('month').subtract('1','month')]
      },
      account_id: accountId
    },
    attributes: [[sequelize.fn('sum', sequelize.col('expected_profit_value')), 'total']],
  })

  let currentMonth = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().startOf('month'), moment().endOf('month')]
      },
      account_id: accountId
    },
    attributes: [[sequelize.fn('sum', sequelize.col('expected_profit_value')), 'total']],
  })
       
  let allTime = await models.VendingTransaction.findAll({
    where: { 
      account_id: accountId
    },
    attributes: [[sequelize.fn('sum', sequelize.col('expected_profit_value')), 'total']],
  })

  const profit = {
    last24 : {
      date: moment().toDate(),
      value : Number(last24[0].toJSON().total).toFixed(2),
    },
    currentWeek : {
      date: moment().startOf('week').toDate(),
      dateEnd: moment().endOf('week').toDate(),
      value : Number(currentWeek[0].toJSON().total).toFixed(2),
    },
    lastWeek : {
      date: moment().startOf('week').subtract('1', 'week').toDate(),
      dateEnd: moment().endOf('week').subtract('1', 'week').toDate(),
      value : Number(lastWeek[0].toJSON().total).toFixed(2),
    },
    currentMonth : {
      date: moment().startOf('month').toDate(),
      dateEnd: moment().endOf('month').toDate(),
      value : Number(currentMonth[0].toJSON().total).toFixed(2),
    },
    lastMonth : {
      date: moment().startOf('month').subtract('1', 'month').toDate(),
      dateEnd: moment().endOf('month').subtract('1', 'month').toDate(),
      value : Number(lastMonth[0].toJSON().total).toFixed(2),
    },
    allTime : {
      date: moment().toDate(),
      value : Number(allTime[0].toJSON().total).toFixed(2),
    }

  }

  return { profit }
}


