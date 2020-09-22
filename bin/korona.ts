#!/usr/bin/env ts-node

import * as http from 'superagent'

(async () => {

  let data = {
    "application": {
      "key": "KORONA.pos-Client",
      "version": "1.95.5"
    },
    "cashier": {
      "name": "Chris Rietmann",
      "number": "1"
    },
    "customerDisplay": {
      "changeOwedText": "change",
      "currency": {
        "isoCode": "USD",
        "name": "US-Dollar",
        "number": "1"
      },
      "digitalReceiptText1": "For a digital receipt \\n please scan the QR-code below",
      "digitalReceiptText2": "We appreciate your efforts \\nin saving nature \\nThanks",
      "price": 2.19,
      "quantity": 1,
      "status": "TO_BE_PAID",
      "text": "total owed",
      "toBePaid": 2.19,
      "toBePaidText": "total owed",
      "total": 2.19
    },
    "customerDisplayConfiguration": {
      "bookingMediaUrl": "masterdata:/images/1",
      "closedMediaUrl": "masterdata:/images/1",
      "closedText": "We'll be back soon!",
      "colorTheme": "GREEN",
      "fontScale": 87,
      "layout": "MEDIA_LEFT_HALF",
      "welcomeMediaUrl": "https://app.anypayinc.com/invoices/58Ctakl5j",
      "welcomeText": "Welcome to Mighty Moose Mart!"
    },
    "inputLine": "",
    "organizationalUnit": {
      "address": {
        "city": "Keene",
        "country": "US",
        "line1": "661 Marlbotro Street",
        "postalCode": "03431",
        "state": "NH"
      },
      "name": "#1 Keene",
      "number": "1"
    },
    "pos": {
      "name": "POS 01",
      "number": "01"
    },
    "receipt": {
      "accountTransactions": [],
      "cashier": {
        "name": "Chris Rietmann",
        "number": "1"
      },
      "counter": 0,
      "creationTime": "2020-09-10T14:34:16.000-04:00",
      "currency": {
        "isoCode": "USD",
        "name": "US-Dollar",
        "number": "1"
      },
      "customerGroup": {
        "name": "Default",
        "number": "1"
      },
      "modificationTime": "2020-09-10T14:49:43.788-04:00",
      "number": "100176",
      "organizationalUnit": {
        "address": {
          "city": "Keene",
          "country": "US",
          "line1": "661 Marlbotro Street",
          "postalCode": "03431",
          "state": "NH"
        },
        "name": "#1 Keene",
        "number": "1"
      },
      "paymentBalance": 2.19,
      "pos": {
        "name": "POS 01",
        "number": "01"
      },
      "readonly": false,
      "sales": [
        {
          "bookingTime": "2020-09-10T14:49:41.279-04:00",
          "cashier": {
            "name": "Chris Rietmann",
            "number": "1"
          },
          "description": "Coffee 20oz",
          "modifier": 1,
          "sortingOrder": 0,
          "alternativeSector": true,
          "hierarchicalOutline": "1",
          "price": 2.19,
          "priceMax": 9999.99,
          "priceMin": -9999.99,
          "product": {
            "commodityGroup": {
              "name": "Coffee",
              "number": "30-01-00"
            },
            "name": "Coffee 20oz",
            "number": "1112",
            "tags": []
          },
          "quantity": 1,
          "receiptRepresentation": {
            "baseItemPrice": 2.19,
            "total": {
              "discount": 0,
              "gross": 2.19,
              "net": 2.19,
              "value": 2.19
            },
            "visible": true
          },
          "recognitionCode": "1112",
          "sector": {
            "name": "Tax Free",
            "number": "2"
          },
          "taxPayments": [
            {
              "amount": 0,
              "taxRate": 0,
              "vat": true
            }
          ],
          "total": {
            "discount": 0,
            "gross": 2.19,
            "net": 2.19,
            "value": 2.19
          }
        }
      ],
      "total": {
        "discount": 0,
        "gross": 2.19,
        "net": 2.19,
        "value": 2.19
      },
      "totalPaid": {
        "roundingError": 0,
        "value": 0
      },
      "voided": false,
      "voucherTransactions": []
    },
    "receiptPrinterConfiguration": {
      "maxCharsPerLine": 42,
      "maxLargeCharsPerLine": 21,
      "maxSmallCharsPerLine": 56
    },
    "systemCurrency": {
      "isoCode": "USD",
      "name": "US-Dollar",
      "number": "1"
    },
    "zcounter": 6
  }

  let result = await http.post('https://api.anypayinc.com/korona_pos/orders?token=c0cbd41c-70c8-4454-9a5c-7309b6285a9d').send(data)

  console.log(result.text)


})()

