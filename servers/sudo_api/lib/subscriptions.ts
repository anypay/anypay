
import { log } from '../../../lib';

export class Subscriptions {

  subscriptions: any = {};

  subscribe(client: any) {

    log.info('socket.subscribe', { client: client.uid });

    this.subscriptions[client.uid] = client;

  }

  unsubscribe(client) {

    delete this.subscriptions[client.uid];

  }

  handleInvoiceCreated(invoice) {

    Object.values(this.subscriptions).forEach((client: any) => {

      client.emit("invoice.created", invoice);

    });
  }

  handleInvoicePaid(invoice) {

    Object.values(this.subscriptions).forEach((client: any) => {

      client.emit("invoice.paid", invoice);

    });
  }

  unsubscribeClient(client) {

    delete this.subscriptions[client.uid];

  }

  getSubscriptions() {

    return this.subscriptions;

  }

}
