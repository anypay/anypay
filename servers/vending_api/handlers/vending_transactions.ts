import {models} from '../../../lib';

import * as moment from 'moment';

const { Op } = require('sequelize')

import * as sequelize from 'sequelize';

export async function getAccountTransactions(request, h) {

  let accountId = request.auth.credentials.accessToken.account_id;

  let machine = await models.VendingMachine.findOne({where: { account_id: accountId }})

  if( machine ){

    let vending_transactions = await models.VendingTransaction.findAll({
      where : { 'terminal_id' : machine.serial_number},
      order: [ [ 'terminal_time', 'DESC' ]]      
    });

    return { vending_transactions }

  }

  return 'No Vending Machine Associated With Account';

}

export async function getLatestTransactions(request, h) {

  let vending_transactions = await models.VendingTransaction.findAll({
    limit: 100,
    order: [ [ 'terminal_time', 'DESC' ]]       
  });

  return {vending_transactions}

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
      type : 'SELL'
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']],
  })

  let currentWeekBuy = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().startOf('week'), moment().endOf('week')]
      },
       type : 'BUY'
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']],
  })

  let currentWeekSell = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().startOf('week'), moment().endOf('week')]
      },
      type : 'SELL'
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']],
  })


 let lastWeekBuy = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().subtract('1', 'week').startOf('week'), moment().subtract('1', 'week').endOf('week')]
      },
       type : 'BUY'
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']],
  })

  let lastWeekSell = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().subtract('1', 'week').startOf('week'), moment().subtract('1','week').endOf('week')]
      },
      type : 'SELL'
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']],
  })


let lastMonthBuy = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().subtract('1', 'month').startOf('month'), moment().subtract('1', 'month').endOf('month')]
      },
       type : 'BUY'
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']],
  })

  let lastMonthSell = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().subtract('1', 'month').startOf('month'), moment().subtract('1','month').endOf('month')]
      },
      type : 'SELL'
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']],
  })

 let currentMonthBuy = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().startOf('month'), moment().endOf('month')]
      },
      type : 'BUY'
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']],
  })

  let currentMonthSell = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().startOf('month'), moment().endOf('month')]
      },
      type : 'SELL'
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']],
  })

  let allTimeBuy = await models.VendingTransaction.findAll({
    where: {
      type : 'BUY'
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']],
  })
        
  let allTimeSell = await models.VendingTransaction.findAll({
    where: {
      type : 'SELL'
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']],
  })

  const revenue = {
    last24 : {
      date: moment().toDate(),
      buy : Number(last24Buy[0].toJSON().total),
      sell : Number(last24Sell[0].toJSON().total),
      volume : Number(last24Sell[0].toJSON().total) + Number(last24Buy[0].toJSON().total),
    },
    currentWeek : {
      date: moment().startOf('week').toDate(),
      buy : Number(currentWeekBuy[0].toJSON().total),
      sell : Number(currentWeekSell[0].toJSON().total),
      volume : Number(currentWeekBuy[0].toJSON().total) + Number(currentWeekSell[0].toJSON().total),
    },
    lastWeek : {
      date: moment().subtract('1', 'week').startOf('week').toDate(),
      buy : Number(lastWeekBuy[0].toJSON().total),
      sell : Number(lastWeekSell[0].toJSON().total),
      volume : Number(lastWeekBuy[0].toJSON().total) + Number(lastWeekSell[0].toJSON().total),
    },
    currentMonth : {
      date: moment().startOf('month').toDate(),
      buy : Number(currentMonthBuy[0].toJSON().total),
      sell : Number(currentMonthSell[0].toJSON().total),
      volume : Number(currentMonthBuy[0].toJSON().total) + Number(currentMonthSell[0].toJSON().total),
    },
    lastMonth : {
      date: moment().subtract('1', 'month').startOf('month').toDate(),
      buy : Number(lastMonthBuy[0].toJSON().total),
      sell : Number(lastMonthSell[0].toJSON().total),
      volume : Number(lastMonthBuy[0].toJSON().total) + Number(lastMonthSell[0].toJSON().total),
    },
    allTime : {
      date: moment().toDate(),
      buy : Number(allTimeBuy[0].toJSON().total),
      sell : Number(allTimeSell[0].toJSON().total),
      volume : Number(allTimeBuy[0].toJSON().total) + Number(allTimeSell[0].toJSON().total),
    }

  }

  return { revenue }
}

export async function getAccountRevenue(request, h) {

  let accountId = request.auth.credentials.accessToken.account_id;

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
        [Op.between]: [moment().subtract('1', 'week').startOf('week'), moment().subtract('1', 'week').endOf('week')]
      },
      account_id: accountId,
       type : 'BUY'
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']],
  })

  let lastWeekSell = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().subtract('1', 'week').startOf('week'), moment().subtract('1','week').endOf('week')]
      },
      account_id: accountId,
      type : 'SELL'
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']],
  })


let lastMonthBuy = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().subtract('1', 'month').startOf('month'), moment().subtract('1', 'month').endOf('month')]
      },
      account_id: accountId,
       type : 'BUY'
    },
    attributes: [[sequelize.fn('sum', sequelize.col('cash_amount')), 'total']],
  })

  let lastMonthSell = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().subtract('1', 'month').startOf('month'), moment().subtract('1','month').endOf('month')]
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
      buy : Number(last24Buy[0].toJSON().total),
      sell : Number(last24Sell[0].toJSON().total),
      volume : Number(last24Sell[0].toJSON().total) + Number(last24Buy[0].toJSON().total),
    },
    currentWeek : {
      date: moment().startOf('week').toDate(),
      buy : Number(currentWeekBuy[0].toJSON().total),
      sell : Number(currentWeekSell[0].toJSON().total),
      volume : Number(currentWeekBuy[0].toJSON().total) + Number(currentWeekSell[0].toJSON().total),
    },
    lastWeek : {
      date: moment().subtract('1', 'week').startOf('week').toDate(),
      buy : Number(lastWeekBuy[0].toJSON().total),
      sell : Number(lastWeekSell[0].toJSON().total),
      volume : Number(lastWeekBuy[0].toJSON().total) + Number(lastWeekSell[0].toJSON().total),
    },
    currentMonth : {
      date: moment().startOf('month').toDate(),
      buy : Number(currentMonthBuy[0].toJSON().total),
      sell : Number(currentMonthSell[0].toJSON().total),
      volume : Number(currentMonthBuy[0].toJSON().total) + Number(currentMonthSell[0].toJSON().total),
    },
    lastMonth : {
      date: moment().subtract('1', 'month').startOf('month').toDate(),
      buy : Number(lastMonthBuy[0].toJSON().total),
      sell : Number(lastMonthSell[0].toJSON().total),
      volume : Number(lastMonthBuy[0].toJSON().total) + Number(lastMonthSell[0].toJSON().total),
    },
    allTime : {
      date: moment().toDate(),
      buy : Number(allTimeBuy[0].toJSON().total),
      sell : Number(allTimeSell[0].toJSON().total),
      volume : Number(allTimeBuy[0].toJSON().total) + Number(allTimeSell[0].toJSON().total),
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
        [Op.between]: [moment().subtract('1', 'week').startOf('week'), moment().subtract('1','week').endOf('week')]
      },
    },
    attributes: [[sequelize.fn('sum', sequelize.col('expected_profit_value')), 'total']],
  })

  let lastMonth = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().subtract('1', 'month').startOf('month'), moment().subtract('1','month').endOf('month')]
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
      profit : Number(last24[0].toJSON().total),
    },
    currentWeek : {
      date: moment().startOf('week').toDate(),
      profit : Number(currentWeek[0].toJSON().total),
    },
    lastWeek : {
      date: moment().subtract('1', 'week').startOf('week').toDate(),
      profit : Number(lastWeek[0].toJSON().total),
    },
    currentMonth : {
      date: moment().startOf('month').toDate(),
      profit : Number(currentMonth[0].toJSON().total),
    },
    lastMonth : {
      date: moment().subtract('1', 'month').startOf('month').toDate(),
      profit : Number(lastMonth[0].toJSON().total),
    },
    allTime : {
      date: moment().toDate(),
      profit : Number(allTime[0].toJSON().total),
    }

  }

  return { profit }
}

export async function getAccountProfit(request, h) {

  let accountId = request.auth.credentials.accessToken.account_id;

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
        [Op.between]: [moment().subtract('1', 'week').startOf('week'), moment().subtract('1','week').endOf('week')]
      },
      account_id: accountId
    },
    attributes: [[sequelize.fn('sum', sequelize.col('expected_profit_value')), 'total']],
  })

  let lastMonth = await models.VendingTransaction.findAll({
    where: {
      server_time: {
        [Op.between]: [moment().subtract('1', 'month').startOf('month'), moment().subtract('1','month').endOf('month')]
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
      profit : Number(last24[0].toJSON().total),
    },
    currentWeek : {
      date: moment().startOf('week').toDate(),
      profit : Number(currentWeek[0].toJSON().total),
    },
    lastWeek : {
      date: moment().subtract('1', 'week').startOf('week').toDate(),
      profit : Number(lastWeek[0].toJSON().total),
    },
    currentMonth : {
      date: moment().startOf('month').toDate(),
      profit : Number(currentMonth[0].toJSON().total),
    },
    lastMonth : {
      date: moment().subtract('1', 'month').startOf('month').toDate(),
      profit : Number(lastMonth[0].toJSON().total),
    },
    allTime : {
      date: moment().toDate(),
      profit : Number(allTime[0].toJSON().total),
    }

  }

  return { profit }
}


