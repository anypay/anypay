
import * as cron from 'node-cron'

import * as core from '../'

interface CronModule {
    pattern: string;
    taskFunction: Function;
    name: string;
}

interface CronJob extends CronModule {
    nodeCronTask: any;
    started: boolean;
}

const requireAll = require('require-all')

const tasks = {}

export function startTask(name: string) {

    const { nodeCronTask } = tasks[name]

    nodeCronTask.start()

    tasks[name].started = true

}

export function stopTask(name: string) {

    const { nodeCronTask } = tasks[name]

    nodeCronTask.stop()

    tasks[name].started = false

}

const requireCronModules = function(dirname: string): CronModule[] {

    const cronFiles = requireAll({

        dirname,
      
        filter:  /(.+)\.ts$/,
      
        resolve: (cronModule) => {

            return {
                taskFunction: cronModule.default,
                pattern: cronModule.pattern
            }
        }
      
    });

    return Object.keys(cronFiles).map(name => {

        const cronModule = cronFiles[name]

        return Object.assign(cronModule, { name })
    })

}

function startCronJob(cronModule: CronModule): CronJob {

    const taskFunctionWithCoreProvided = async () => {

        const { name, pattern } = cronModule

        core.log.info('rabbi.cron.start', { name, pattern })

        try {

            return cronModule.taskFunction(core)
            
        } catch(error){ 

            core.log.error(`rabbi.cron.${name}.error`, error)

            return error
            
        }

    }

    const nodeCronTask = cron.schedule(cronModule.pattern, taskFunctionWithCoreProvided)

    const cronJob = Object.assign(cronModule, {nodeCronTask, started: true})

    tasks[cronModule.name] = cronJob

    return cronJob

}

export function startDirectory(dirname: string): CronJob[] {

    const cronModules = requireCronModules(dirname)

    return cronModules.map(startCronJob)

}

export function startCronFile(filePath: string, pattern?: string): CronJob {

    const fileModule = require(filePath)

    const fileName = filePath.split('/').pop()

    const name = fileName.split('.').slice(0, -1).join('.')

    return startCronJob({
        taskFunction: fileModule.default,
        pattern: pattern || fileModule.pattern,
        name
    })

}

export function listCronJobs() {

    return Object.keys(tasks).map(name => {
        
        const { pattern, started } = tasks[name]

        return {
            name, pattern, started
        }
    })

}

export function getCronJob(name: string): CronJob {

    return tasks[name]
}
