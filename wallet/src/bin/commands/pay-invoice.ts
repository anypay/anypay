
exports.command = 'pay-invoice <invoice_uid>'

exports.builder = (args) => {

  args.option('c', {
    alias: 'currency',
    required: true
  })

  args.option('n', {
    alias: 'chain',
    required: true
  })

}

exports.handler = (argv) => {

  const chain = argv['n']
  const currency = argv['c']
  const uid = argv['invoice_uid']

  console.log('pay-invoice', { chain, currency, uid })

}
