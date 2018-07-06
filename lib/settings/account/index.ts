
class AccountDenominationSettings {

  accountId: number;
  
  constructor(accountId: number) {
    this.accountId = accountId; 
  }
  
  getDenomination(): Promise<string> {

    let account = await AccountModel.findOne({
      where: {
        id: this.accountId
      }
    });

    return account.denomination;

  }

  setDenomination(currency: string): Promise<string> {

    await AccountModel.update({
      denomination: currency  
    }, {
      where: {
        id: this.accountId
      }
    });

    return currency;
  }

}

export default function(accountId: number): Promise<AccountDenominationSettings>{

  return new AccountDenominationSettings(accountId);

}

