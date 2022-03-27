
import { Orm } from '../../lib/orm'

import { models } from '../../lib/models'

import * as utils from '../utils'

class Invoice extends Orm {}

describe("ORM Base Class", () => {

  it('should wrap a sequelize Model class', async() => {

    Invoice.model = models.Invoice

  })

})
