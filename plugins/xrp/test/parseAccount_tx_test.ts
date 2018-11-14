require('dotenv').config();

require('../../../actors/payment_publisher')

import{emitter} from '../../../lib/events'

import {parsePaymentsFromAccount_tx} from '../lib/ripple_restAPI'

import {Payment} from '../../../types/interfaces'

import * as assert from 'assert'

let payments:Payment[]=
[{
  currency:"XRP",
  address:"r3pzYrVu7oruSJh1jhACmb6wRDkTWVw1JJ?dt=4774246",
  amount:0.2122,
  hash:"198B475CFD2B0693966D684CD33C2950BFA235F25F68F78FB5797FF87B40E97F"
 },
 {
  currency:"XRP",
  address:"r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk?dt=855007911",
  amount: 0.48348,
  hash: "D7D181E7F2BA66F5180806999EC105AF53D5108CF6EEBC4A5E5ABFB7A4268611"
 },
 {
  currency:"XRP",
  address:"r3pzYrVu7oruSJh1jhACmb6wRDkTWVw1J?dt=0",
  amount:20,
  hash:"7F47A8AE1A17EE6D7EF47E5732ED99F17D5514EEE29E5D77AD8AC56556B7390B"
 }
]

describe("Checking function to parse incoming payments", ()=>{

  it("should parse transactions", (done)=>{

     let sem = false

     let counter = 0;
    emitter.on('payment',(p)=>{
      if(!sem){
        done()
        }
      assert(p.currency == payments[counter].currency)
      assert(p.amount == payments[counter].amount)
      assert(p.address, payments[counter].address)
      assert(p.hash == payments[counter].hash)

      counter++;
      sem = true;
    })

     parsePaymentsFromAccount_tx(getData())

  })
 
})

function getData(){

return `{"id":2,"result":{"account":"r3pzYrVu7oruSJh1jhACmb6wRDkTWVw1JJ","ledger_index_max":42935181,"ledger_index_min":32570,"limit":10,"transactions":[{"meta":{"AffectedNodes":[{"ModifiedNode":{"FinalFields":{"Account":"r3pzYrVu7oruSJh1jhACmb6wRDkTWVw1JJ","Balance":"20212188","Flags":0,"OwnerCount":0,"Sequence":2},"LedgerEntryType":"AccountRoot","LedgerIndex":"0DFCFBE9FBBCCAE7CEE447E34447E1A45472760204981C8766C5A45F26152752","PreviousFields":{"Balance":"19999988"},"PreviousTxnID":"D7D181E7F2BA66F5180806999EC105AF53D5108CF6EEBC4A5E5ABFB7A4268611","PreviousTxnLgrSeq":42694215}},{"ModifiedNode":{"FinalFields":{"Account":"rhNY5uxRGpn6QHJoXbPSTGzkD9yv6b6oDE","Balance":"27595404","Flags":0,"OwnerCount":0,"Sequence":4},"LedgerEntryType":"AccountRoot","LedgerIndex":"BBD8B25C501857E6AEF8F62F8C3C4E3EAEFD15CE070C03C90747F45C205F7117","PreviousFields":{"Balance":"27807616","Sequence":3},"PreviousTxnID":"E22073AF070422B8F9A17FDA2EAF6A834FCCD904D313BBDEE02E20B84BBC78FE","PreviousTxnLgrSeq":42932560}}],"TransactionIndex":0,"TransactionResult":"tesSUCCESS","delivered_amount":"212200"},"tx":{"Account":"rhNY5uxRGpn6QHJoXbPSTGzkD9yv6b6oDE","Amount":"212200","Destination":"r3pzYrVu7oruSJh1jhACmb6wRDkTWVw1JJ","DestinationTag":4774246,"Fee":"12","Flags":2147483648,"LastLedgerSequence":42935395,"Sequence":3,"SigningPubKey":"ED81DE3C38C331256902739DBF6916247A25EF875CC2B1AD33F6DC6C499B1A5A00","TransactionType":"Payment","TxnSignature":"079E75EB93FF0EB0DA97DFE671AF981A8B54B653BEE48F4E50AD7A73878213120F032D49E43B3A2F40632FC22D5F640DD140405CAB3021CB7AF2E40AEBA8B80A","date":595369973,"hash":"198B475CFD2B0693966D684CD33C2950BFA235F25F68F78FB5797FF87B40E97F","inLedger":42935098,"ledger_index":42935098},"validated":true},{"meta":{"AffectedNodes":[{"ModifiedNode":{"FinalFields":{"Account":"r3pzYrVu7oruSJh1jhACmb6wRDkTWVw1JJ","Balance":"19999988","Flags":0,"OwnerCount":0,"Sequence":2},"LedgerEntryType":"AccountRoot","LedgerIndex":"0DFCFBE9FBBCCAE7CEE447E34447E1A45472760204981C8766C5A45F26152752","PreviousFields":{"Balance":"20000000","Sequence":1},"PreviousTxnID":"7F47A8AE1A17EE6D7EF47E5732ED99F17D5514EEE29E5D77AD8AC56556B7390B","PreviousTxnLgrSeq":42594675}}],"TransactionIndex":18,"TransactionResult":"tecUNFUNDED_PAYMENT"},"tx":{"Account":"r3pzYrVu7oruSJh1jhACmb6wRDkTWVw1JJ","Amount":"483480","Destination":"r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk","DestinationTag":855007911,"Fee":"12","Flags":2147483648,"LastLedgerSequence":42694243,"Sequence":1,"SigningPubKey":"03168C6207080004389444A6CDE02EF790D4437CA2F0BF722C4696470B4D5E935D","SourceTag":0,"TransactionType":"Payment","TxnSignature":"3045022100DB97DFEB77C4241F0144DCF0DF8FA8383DB416C582E729ED9AD0D6F456250B680220197D82E5FD7E1C12C7A386A5065CCBE292DB475179D96548589B4290389FCAD1","date":594507642,"hash":"D7D181E7F2BA66F5180806999EC105AF53D5108CF6EEBC4A5E5ABFB7A4268611","inLedger":42694215,"ledger_index":42694215},"validated":true},{"meta":{"AffectedNodes":[{"CreatedNode":{"LedgerEntryType":"AccountRoot","LedgerIndex":"0DFCFBE9FBBCCAE7CEE447E34447E1A45472760204981C8766C5A45F26152752","NewFields":{"Account":"r3pzYrVu7oruSJh1jhACmb6wRDkTWVw1JJ","Balance":"20000000","Sequence":1}}},{"ModifiedNode":{"FinalFields":{"Account":"rfwPAYShmdM3BYeCwAN3kciKXuYG1XFiCp","Balance":"2696128264","Flags":0,"OwnerCount":0,"Sequence":5},"LedgerEntryType":"AccountRoot","LedgerIndex":"E7BAB956D7D148F394C55F0FEFB247943DD155FD8090AA239F20B8F5B52DB1F5","PreviousFields":{"Balance":"2716128276","Sequence":4},"PreviousTxnID":"D4B7027EC7A25776A77BC442265B49187FDD4C3690C7C7CD8D46D2200E6D6DE6","PreviousTxnLgrSeq":35031676}}],"TransactionIndex":17,"TransactionResult":"tesSUCCESS","delivered_amount":"20000000"},"tx":{"Account":"rfwPAYShmdM3BYeCwAN3kciKXuYG1XFiCp","Amount":"20000000","Destination":"r3pzYrVu7oruSJh1jhACmb6wRDkTWVw1JJ","DestinationTag":0,"Fee":"12","Flags":2147483648,"LastLedgerSequence":42594702,"Sequence":4,"SigningPubKey":"031B372028CFB3CA55E5D40F5F2802FBBEB6D6F1E936351947048AD5895C33CD6F","SourceTag":0,"TransactionType":"Payment","TxnSignature":"30440220648D0073AE8D297AF344B07A7F6BAEDFBA5155B5158D2391E55D6469E9BEBB460220577A6F8759D9544D5272E0EDA762272123324D868B88C150F482F085181A9229","date":594149702,"hash":"7F47A8AE1A17EE6D7EF47E5732ED99F17D5514EEE29E5D77AD8AC56556B7390B","inLedger":42594675,"ledger_index":42594675},"validated":true}]},"status":"success","type":"response"}`

}

