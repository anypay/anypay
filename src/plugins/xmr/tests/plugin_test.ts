
import { expect, spy } from '@/test/utils'
import * as plugin from '@/plugins/xmr'

describe("XMR Plugin", () => {

    it('#validateAddress should return true by default', async () => {

        //@ts-ignore
        const valid = await plugin.validateAddress({ value: 'someaddress' })

        expect(valid).to.be.equal(true)

    })

    it('#validateUnsignedTx should return true by default', async () => {

        //@ts-ignore
        const valid = await plugin.validateUnsignedTx({ tx_hex: 'validate_some_unsigned_tx' })

        expect(valid).to.be.equal(true)
        
    })

    it("#broadcastTx should call rpc send_raw_transaction", async () => {

        console.log({ spy })

        spy.on(plugin, ['send_raw_transaction'])

        expect(
            //@ts-ignore
            plugin.broadcastTx({ tx: 'tx_hex' })
        )
        .to.be.eventually.rejectedWith(new Error())

        expect(plugin.send_raw_transaction).to.have.been.called

    })

    it("#broadcastTx should call to re-trasmit the transaction a second time", async () => {

        spy.on(plugin, ['send_raw_transaction'])

        expect (
            //@ts-ignore
            plugin.broadcastTx({ tx: 'tx_hex' })
        )
        .to.be.eventually.rejected // TODO: Make successful

        expect(plugin.send_raw_transaction).to.have.been.called.twice
        
    })

    it("#send_raw_transaction should call the rpc send_raw_transaction", async () => {

        expect (

            plugin.send_raw_transaction({ tx_as_hex: 'tx_hex', do_not_relay: false })
        )
        .to.be.eventually.rejected

    })

    it('#verify should use monero wallet rpc to verify the outputs of a payment', async () => {

        expect (

            plugin.verify({ url: '', tx_hash: '', tx_key: '' })
        )
        .to.be.eventually.rejected

    })

    it('#verifyPayment should first submit not broadcast, then verify, the broadcast', async () => {

        expect (
            plugin.verifyPayment({
                payment_option: {},
                transaction: {
                    //@ts-ignore
                    tx: 'my_great_transaction'
                }
            })
        )
        .to.be.eventually.rejected

        expect(plugin.send_raw_transaction).on.nth(1).called.with({
            tx_as_hex: 'my_great_transaction',
            do_not_relay: true
        })

        expect(plugin.send_raw_transaction).on.nth(2).called.with({
            tx_as_hex: 'my_great_transaction',
            do_not_relay: false
        })

    })

    it('#check_tx_key should call the wallet rpc command for check_tx_key', async () => {

        spy.on(plugin, ['callWalletRpc'])

        await plugin.check_tx_key({ tx_hash: '', tx_key: '', address: ''})

        expect(plugin.callWalletRpc).to.have.been.called

    })
})