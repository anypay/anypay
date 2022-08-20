import {Command, Flags, CliUx} from '@oclif/core'

import { models } from '../../../../../lib/models'

export default class GetAccessToken extends Command {
  static description = 'describe the command here'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    // flag with a value (-n, --name=VALUE)
    name: Flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: Flags.boolean({char: 'f'}),
  }

  static args = [{name: 'file'}]

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(GetAccessToken)

    const name = flags.name ?? 'world'

    this.log(`wallet-bot-cli.get-access-tokens`)

    const email = await CliUx.ux.prompt('What is your email address?')

    const password = await CliUx.ux.prompt('What is your password?', {type: 'hide'})

    const secondFactor = await CliUx.ux.prompt('What is your two-factor token?', {type: 'mask'})

    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}
