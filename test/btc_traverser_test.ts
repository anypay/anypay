
import * as assert from 'assert'

import * as traverser from '../lib/btc_traverser'

const txid = '38c3dd42f5bd5984ca7d5c170ccaadd2220155cbec8d071792e58992812b2592'

describe("BTC Traverser", () => {

  it('should get all the ancestors at level 1', async () => {

    let t = new traverser.BTCTraverser(txid)

    assert.strictEqual(t.currentAncenstorLevel, 0)

    await t.getNextAncesorLevel()

    assert.strictEqual(t.currentAncenstorLevel, 1)

    var ancestors = t.getCurrentAncenstors()

    assert.strictEqual(ancestors.length, 1)

    assert.strictEqual(ancestors[0].txid, '56bf09ce0026b3bfa2a5daab1e6e665d52fd0b27c14c420b33e36c48134d699e')

    await t.getNextAncesorLevel()

    assert.strictEqual(t.currentAncenstorLevel, 2)

    ancestors = t.getCurrentAncenstors()

    assert.strictEqual(ancestors.length, 1)

    assert.strictEqual(ancestors[0].txid, '74b1779bac755e460c208f7958681ebabfecd7352b049673508afb3eb5b9996f')


  })

  it('should traverse and keep state', async () => {

    let t = new traverser.BTCTraverser(txid)

    await t.traverseAncestors(2)

    var ancestors = t.getCurrentAncenstors()

    assert.strictEqual(ancestors.length, 1)

    assert.strictEqual(ancestors[0].txid, '74b1779bac755e460c208f7958681ebabfecd7352b049673508afb3eb5b9996f')

  })

  it('should get the node for a single transaction', async () => {

    let node = await traverser.getNode(txid)

    assert(node.txid)
    assert(node.tx)
    assert(node.rawtx)
    assert.strictEqual(node.parents.length, 0)
    assert.strictEqual(node.children.length, 0)

  })

  it('should get the parents one level up', async () => {

    var node = await traverser.getNode(txid)

    var [node, parents] = await traverser.getParents(node)

    for (let parent of parents) {
      assert.strictEqual(parent.children.length, 1)
    }

    assert.strictEqual(node.parents.length, parents.length)

  })

})

