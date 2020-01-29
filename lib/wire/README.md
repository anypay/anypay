We send "wire transfers", or ACH batch transfers every
single day to one company, soon to be many.

The current process relies on keeping track of the latest
invoice accounted for by a wire. Currently this invoice id
is tracked only in Derrick's email! 

The latest invoice id processed needs to be stored in the
database along with the account and the wire information.

Then every morning it should pre-compute the wire that Derrick
should send. Every single wire or ACH record must have a
start invoice and and end invoice. That way we can keep track
of the latest ACH paid, and use its ending invoice as 
refernce to replace Derrick's email accounting.

1. At 11am generate an email to Derrick containing a message

```
Your ACH transfer to eGifter today will be $3921.62 to Account Number [ACCOUNT NUMBER]

Please send the transfer and then record the ACH Batch ID and Effective Date
in the sudo dashboard here: https://sudo.anypayinc.com/#/record-ach-batch

```

