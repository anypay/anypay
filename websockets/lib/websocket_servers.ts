
class Server {

  server_id: string;

  server_ip: string;

  websockets: any = {};

  constructor(server_id: string, server_ip: string) {

    this.server_id = server_id;

    this.server_ip = server_ip;

  }

  async addWebsocket(websocket: Websocket) {

    this.websockets[websocket.websocket_id] = websocket;

  }

  async removeWebsocket(websocket: Websocket) {

    delete this.websockets[websocket.websocket_id];

  }
    
}

interface Websocket {
  server_id: string;
  websocket_id: string;
}

interface ServersMap {
  [server_id: string]: Server
}

class ServerDashboard {

  servers: ServersMap = {};

  async listServers(): Promise<Server[]> {
    return Object.values(this.servers);
  }

  async addServer(server: Server): Promise<Server> {
    this.servers[server.server_id] = server;
    return server;
  }

  async removeServer(server_id: string): Promise<string> {

    if (this.servers && this.servers[server_id]) {

      delete this.servers[server_id];

    }

    return server_id;
  }

  async addWebsocket(websocket: Websocket) {

    let server = this.servers[websocket.server_id];

    if (server && server.addWebsocket) {

      server.addWebsocket(websocket);

    }

  }

  async removeWebsocket(websocket: Websocket) {

    let server = this.servers[websocket.server_id];

    if (server && server.removeWebsocket) {

      server.removeWebsocket(websocket);

    }

  }

}

const websocket_servers = new ServerDashboard();

abstract class AccountSubscriptions {

  subscriptions: any = {};

  accounts: any = {};

  // override this in subclasses
  abstract messageClient(client: any, event: string, payload: any);

  handleAccountEvent(accountId, event, payload) {

    console.log('handleAccountEvent', {
      accountId, event, payload
    });

    if (this.accounts[accountId]) {

      this.accounts[accountId].forEach(client => {
        console.log(`messaging client for account ${accountId}`);

        this.messageClient(client, event, payload);


      });

    }
  }

  subscribeAccount(client, accountId) {

    this.subscriptions[client.socket_id] = accountId;

    if (!this.accounts[accountId]) {

      this.accounts[accountId] = [];

    }

    this.accounts[accountId].push(client);
  }

  unsubscribeClient(client) {

    let accountId = this.subscriptions[client.socket_id];

    if (this.accounts[accountId]) {

      this.accounts[accountId] = this.accounts[accountId].filter(c => {

        return c.socket_id !== client.socket_id;

      });

    }

    delete this.subscriptions[client.socket_id];

  }

  getSubscriptions() {

    return this.subscriptions;

  }

}

class AccountSubscriptionsWebsockets extends AccountSubscriptions {

  messageClient(client: any, event: string, payload: any) {

    try {

      console.log(JSON.stringify({ event, payload }))

      client.send(JSON.stringify({ event, payload }));

    } catch(error) {

      console.error(error.message);

      console.error(`error sending message to websocket client ${client.socket_id}`);

    }

  }

}

const account_subscriptions = new AccountSubscriptionsWebsockets();

export {

  websocket_servers,

  account_subscriptions

}

