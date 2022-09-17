
import { listCronJobs, startDirectory, stopTask, startTask, getCronJob } from '../cron'

import { expect } from 'chai'

describe('Framework for Cron Jobs', () => {

  before(() => {

    startDirectory(`${__dirname}/../../../cron`)

  })

  it('should have a cron named wallet_bot_send_on_interval', () => {

    const cronJobs = listCronJobs()

    const cronJob = cronJobs.filter(({ name }) => name === 'wallet_bot_send_on_interval')[0]

    expect(cronJob.name).to.be.equal('wallet_bot_send_on_interval')

    expect(cronJob.pattern).to.be.equal('*/10 * * * * *')

  })

  it('stop and start task should toggle the status of started property', () => {

    let cronJob = getCronJob('wallet_bot_send_on_interval')

    expect(cronJob.started).to.be.equal(true)

    stopTask(cronJob.name)

    cronJob = getCronJob('wallet_bot_send_on_interval')

    expect(cronJob.started).to.be.equal(false)

    startTask(cronJob.name)

    expect(cronJob.started).to.be.equal(true)

  })

})
