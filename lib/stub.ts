
interface StubOptions {
  business_name: string;
  city?: string;
}

const punctuation = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g

export function build(options: StubOptions): string {

  var accountStub = options.business_name.toLowerCase().replace(punctuation, '').replace(' ', '-')

  if (options.city) {

    let cityStub = options.city.toLowerCase().replace(punctuation, '').replace(' ', '-')
    
    accountStub = `${accountStub}-${cityStub}`
  }

  return accountStub  

}

export async function updateAccount(account, Account) {

  if (!account.business_name) {

    var existing = await Account.findOne({ where: {
      stub: account.id.toString()
    }})

    if (!existing) {

      account.stub = account.id 

      await account.save()

      return
    }
  }

  var accountStub = build({ business_name: account.business_name }) 

  var existing = await Account.findOne({ where: {
    stub: accountStub
  }})

  if (!existing) {

    account.stub = accountStub

    await account.save()

  } else {

    if (account.city) {

      accountStub = build({ business_name: account.business_name, city: account.city })

      existing = await Account.findOne({ where: {
        stub: accountStub
      }})

      if (!existing) {

        account.stub = accountStub

        await account.save()

      }

    }


  }

}
