/*

    payment_confirmed webhook:

    {
        type: 'payment_confirmed',
        invoice_uid: '5a9b5f0c-0b1f-4b0f-8c1c-8c1c8c1c8c1c',
        txid: '2e48fcecc96c7742c7665df06a8f65ba2e8ed0aff7288d4c6225c7a96b4fffa8',
        status: 'confirmed',
        confirmation_height: 656222,
        confirmation_hash: '0000000000000000000000000000000000000000000000000000000000000000',
        confirmation_time: '2019-01-01T00:00:00.000Z'
    }

*/

export interface PaymentConfirmedWebhook {
    type: string;
    invoice_uid: string;
    txid: string;
    status: string;
    confrmation_height: number;
    confirmation_hash: string;
    confirmation_time: Date;
}