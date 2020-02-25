
# Converting to Bank Account via ACH

Some accounts want to convert payments from digital currency
to the bank account, a service which we offer to a select and
growing customer base.

Accounts may opt in to conversion to their bank account by
configuring bank account details for their account in the
bank_accounts table, and then enabling bank transfers with a 
flag on their account. When bank transfers are enabled for
an account every invoice generated will also be marked as
destined for a bank account instead of for normal forwarding
on to the destination bitcoin address.

Invoices which have received a payment and are marked as convert
to bank account will be including in the next ACH batch for
that account. Once an invoice has been forwarded to a bank
account by inclusion in an ACH batch file it will be updated
to include the ACH batch id from the batch. All invoices that
include an ACH batch id will be considered settled and finalized.
All invoices that do not include an ACH batch id will be considered
still pending. 

Although an ACH batch record may have been created that does
not necessarily mean the ACH batch has been sent to the bank
or confirmed by the bank. We can consider any ACH batch record
to have been sent to the bank whenever the record contains a
bank batch id from the bank. Finally we must update the ACH batch
record to indicate it has been finalized once the bank confirms
completion of the transfer.


