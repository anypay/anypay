
export class RoutingKeyBindings {

  sockets: any = {};

  routingKeyBindings: any = {};

  bindSocket(socket, routingKey) {

    if (this.sockets[socket.id]) {

      this.sockets[socket.id].push(routingKey);

    } else {

      this.sockets[socket.id] = [routingKey];

    }

    if (!this.routingKeyBindings[routingKey]) {

      this.routingKeyBindings[routingKey] = {}

    }

    this.routingKeyBindings[routingKey][socket.id] = socket;

  }

  unbindSocket(socket) {

    this.sockets[socket.id].forEach(routingKey => {

      if (this.routingKeyBindings[routingKey]) {

        delete this.routingKeyBindings[routingKey][socket.id];

      }

    });

    delete this.sockets[socket.id];

  }

  getSockets(routingKey) {

    return Object.values(this.routingKeyBindings[routingKey]);

  }
}

