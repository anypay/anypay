# ACH Settlement Accounting

Each Settlement is composed of one or more paid invoices. Upon creation of an ACH batch each invoice involved will
be added to the ach batch and associated in the database. A user receiving ACH settlements may see a list of ACHs in
their account, and click on each ACH batch to see the exact list of transactions belonging to that settlement batch.
The total of each ACH settlement will exactly equal the sum of all the invoice amounts paid.

# Settlements

A Settlement hasMany Invoices
A Settlement's total_amount is equal to the sum of the invoices minus the Settlement's total_fees
A Settlement always belongsTo an account and must contain an account_id
A Settlement always has a currency 

