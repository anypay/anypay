
abstract class AccountSubscriptions {

  subscriptions: any = {};

  invoices: any = {};

  // override this in subclasses
  abstract messageClient(client: any, event: string, payload: any);

  handleAccountEvent(accountId, event, payload) {

    console.log('handleAccountEvent', {
      accountId, event, payload
    });

    if (this.invoices[accountId]) {

      this.invoices[accountId].forEach(client => {
        console.log(`messaging client for account ${accountId}`);

        this.messageClient(client, event, payload);


      });

    }
  }

  subscribeAccount(client, accountId) {

    this.subscriptions[client.uid] = accountId;

    if (!this.invoices[accountId]) {

      this.invoices[accountId] = [];

    }

    this.invoices[accountId].push(client);
  }

  unsubscribeClient(client) {

    let accountId = this.subscriptions[client.uid];

    if (this.invoices[accountId]) {

      this.invoices[accountId] = this.invoices[accountId].filter(c => {

        return c.uid !== client.uid;

      });

    }

    delete this.subscriptions[client.uid];

  }

  getSubscriptions() {

    return this.subscriptions;

  }

}

export class AccountSubscriptionsWebsockets extends AccountSubscriptions {

  messageClient(client: any, event: string, payload: any) {

    try {

      console.log(JSON.stringify({ event, payload }))

      client.send(JSON.stringify({ event, payload }));

    } catch(error) {

      console.error(error.message);
      console.error(`error sending message to websocket client ${client.uid}`);

    }

  }

}

export class AccountSubscriptionsSocketIO extends AccountSubscriptions {

  messageClient(client: any, event: string, payload: any) {

    try {

      console.log(`client.${client.uid}`, JSON.stringify({ event, payload }));

      client.emit('message', { event, payload });

    } catch(error) {

      console.error(error.message);
      console.error(`error sending message to websocket client ${client.uid}`);

    }

  }

}

let accountSubscriptionsSocketIO = new AccountSubscriptionsSocketIO();
let accountSubscriptionsWebsockets = new AccountSubscriptionsWebsockets();

export {
  accountSubscriptionsSocketIO,
  accountSubscriptionsWebsockets
}

