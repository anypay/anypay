
import { models } from '../models'

interface Account {
  id: number
}

export class Addresses {

  account: Account;

  constructor(account: Account) {
    this.account = account
  }

  async unsetAll() {
    let result = await models.Address.destroy({
      where: {
        account_id: this.account.id
      }
    })
  }

  async update(currency: string, address: string) {

    console.log('UPDATE', { currency, address })

    let [record, isNew] = await models.Address.findOrCreate({
      where: {
        account_id: this.account.id,
        currency
      },
      defaults: {
        account_id: this.account.id,
        value: address,
        currency
      }
    })

    console.log("IS NEW", isNew)

    if (!isNew) {
      record.value = address
      await record.save()
    }
    
  }

}

