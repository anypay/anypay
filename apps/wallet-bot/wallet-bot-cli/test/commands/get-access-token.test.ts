import {expect, test} from '@oclif/test'

describe('get-access-token', () => {
  test
  .stdout()
  .command(['get-access-token'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['get-access-token', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
