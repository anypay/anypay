
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

