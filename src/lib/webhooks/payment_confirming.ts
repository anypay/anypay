/*

    payment_confirming webhook:

    {
        type: 'payment_confirming',
        invoice_uid: '5a9b5f0c-0b1f-4b0f-8c1c-8c1c8c1c8c1c',
        txid: '2e48fcecc96c7742c7665df06a8f65ba2e8ed0aff7288d4c6225c7a96b4fffa8',
        status: 'confirming',
        time: '2019-01-01T00:00:00.000Z'
    }

*/


export interface PaymentConfirmingWebhook {
    type: string;
    invoice_uid: string;
    txid: string;
    status: string;
    time: Date
}