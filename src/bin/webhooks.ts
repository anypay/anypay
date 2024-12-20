#!/usr/bin/env ts-node
/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================

require('dotenv').config();

import { Command } from 'commander';
const program = new Command();

import { sendWebhookForInvoice } from '@/lib/webhooks';

import { WebhookBuilder } from '@/webhooks/builder'

program
  .option('-d --dry-run')
  .option('-u --url')

program
  .command('sendwebhook <invoice_uid>')
  .action(async (invoiceUid) => {

    try {

      let resp:any = await sendWebhookForInvoice(invoiceUid);

      console.log(resp);

      console.log(resp.statusCode, resp.body);

    } catch(error) {

      console.log('error', error);

    }

    process.exit(0);
  
  });

// ./src/bin/webhooks.ts invoice.created --dry-run --invoice-uid=F28WujS5X | jq
program
  .command('invoice.created')
  .requiredOption('-i --invoice-uid <invoice_uid>')
  .action(async (localOptions) => {

    const { dryRun, url } = program.opts()

    if (!url && !dryRun) {
      throw new Error('Missing required option: --url or --dry-run')
    }

    const builder = new WebhookBuilder({      
      topic: 'invoice.created',
      params: {
        invoice_uid: localOptions.invoiceUid
      }
    })

    if (dryRun) {

      const payload = await builder.buildPayload()
      console.log(JSON.stringify(payload))

    } else {
      
      const result = await builder.sendWebhook({ url })
      console.log(JSON.stringify(result))
    }

  })

  // ./src/bin/webhooks.ts invoice.cancelled --dry-run --invoice-uid=s5hBTSIN2 | jq
  program
    .command('invoice.cancelled')
    .requiredOption('-i --invoice-uid <invoice_uid>')
    .action(async (localOptions) => {

      const { dryRun, url } = program.opts()

      if (!url && !dryRun) {
        throw new Error('Missing required option: --url or --dry-run')
      }

      const builder = new WebhookBuilder({      
        topic: 'invoice.cancelled',
        params: {
          invoice_uid: localOptions.invoiceUid
        }
      })

      if (dryRun) {

        const payload = await builder.buildPayload()
        console.log(JSON.stringify(payload))

      } else {
        
        const result = await builder.sendWebhook({ url })
        console.log(JSON.stringify(result))
      }

    })

  program
    .command('invoice.paid')
    .requiredOption('-i --invoice-uid <invoice_uid>')
    .action(async (localOptions) => {

      const { dryRun, url } = program.opts()

      if (!url && !dryRun) {
        throw new Error('Missing required option: --url or --dry-run')
      }

      const builder = new WebhookBuilder({      
        topic: 'invoice.paid',
        params: {
          invoice_uid: localOptions.invoiceUid
        }
      })

      if (dryRun) {

        const payload = await builder.buildPayload()
        console.log(JSON.stringify(payload))

      } else {
        
        const result = await builder.sendWebhook({ url })
        console.log(JSON.stringify(result))
      }

    })

// ./src/bin/webhooks.ts payment.confirming --dry-run --invoice-uid=F28WujS5X | jq
program
  .command('payment.confirming')
  .requiredOption('-i --invoice-uid <invoice_uid>')
  .action(async (localOptions) => {

    const { dryRun, url } = program.opts()

    if (!url && !dryRun) {
      throw new Error('Missing required option: --url or --dry-run')
    }

    const builder = new WebhookBuilder({      
      topic: 'payment.confirming',
      params: {
        invoice_uid: localOptions.invoiceUid
      }
    })

    if (dryRun) {

      const payload = await builder.buildPayload()
      console.log(JSON.stringify(payload))

    } else {
      
      const result = await builder.sendWebhook({ url })
      console.log(JSON.stringify(result))
    }

  })

// ./src/bin/webhooks.ts payment.confirmed --dry-run --invoice-uid=TJBAW97r_ | jq
program
  .command('payment.confirmed')
  .requiredOption('-i --invoice-uid <invoice_uid>')
  .action(async (localOptions) => {

    const { dryRun, url } = program.opts()

    if (!url && !dryRun) {
      throw new Error('Missing required option: --url or --dry-run')
    }

    const builder = new WebhookBuilder({      
      topic: 'payment.confirmed',
      params: {
        invoice_uid: localOptions.invoiceUid
      }
    })

    if (dryRun) {

      const payload = await builder.buildPayload()
      console.log(JSON.stringify(payload))

    } else {
      
      const result = await builder.sendWebhook({ url })
      console.log(JSON.stringify(result))
    }

  })

program
  .command('payment.failed')
  .requiredOption('-i --invoice-uid <invoice_uid>')
  .action(async (localOptions) => {

    const { dryRun, url } = program.opts()

    if (!url && !dryRun) {
      throw new Error('Missing required option: --url or --dry-run')
    }

    const builder = new WebhookBuilder({      
      topic: 'payment.failed',
      params: {
        invoice_uid: localOptions.invoiceUid
      }
    })

    if (dryRun) {

      const payload = await builder.buildPayload()
      console.log(JSON.stringify(payload))

    } else {
      
      const result = await builder.sendWebhook({ url })
      console.log(JSON.stringify(result))
    }

  }) 

program.parse(process.argv);

