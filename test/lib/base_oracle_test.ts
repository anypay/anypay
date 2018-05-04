import {BaseOracle} from '../../lib/oracles/base'
import {Oracles} from '../../lib/oracles'

describe("Base Oracle", () => {


  describe("extending base oracle with a new name", () => {

    it("should validly implement the Oracle interface", () => {

      class NewCoin extends BaseOracle {
        name: 'newcoin'
      }

      let oracles = new Oracles();
      
      oracles.registerOracle(new NewCoin())
    })

  })
})

