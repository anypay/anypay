import { PrismaClient } from "@prisma/client";
import { WebhookServer } from "@/webhooks/server";
import { Logger, log } from "@/lib/log";
import { HttpApiServer } from "@/http_api_server";
import prisma from '@/lib/prisma'
import { AnypayWebsocketServer, buildServer } from "@/websockets/server";

import { merge } from "ts-deepmerge";

interface AnypayServerParams {
    amqp?: {
        url: string
        exchange: string
    },
    webhooks?: boolean;
    websockets?: {
        host: string
        port: number
    },
    http?: {
        host: string
        port: number
    },
    log: Logger;
    prisma: PrismaClient;
}

interface AnypayServerProps extends AnypayServerParams {
    amqp: {
        url: string
        exchange: string
    },
    webhooks: boolean;
    websockets: {
        host: string
        port: number
    },
    http: {
        host: string
        port: number
    },
    log: Logger;
    prisma: PrismaClient;
}

const defaultAnypayServerProps: AnypayServerParams = {

    http: {
        host: '0.0.0.0',
        port: 5200
    },
    websockets: {
        host: '0.0.0.0',
        port: 5202
    },
    webhooks: true,

    amqp: {
        url: 'amqp://guest:guest@localhost:5672',
        exchange: 'anypay'
    },

    prisma,

    log,
}

export class AnypayServer {

    log: Logger;
  
    prisma: PrismaClient;
  
    webhook_server: WebhookServer;

    http_api_server: HttpApiServer;    

    amqp: {
        url: string
        exchange: string
    }
  
    websocket_server?: AnypayWebsocketServer;

    constructor(params: AnypayServerParams) {

      const props = merge(defaultAnypayServerProps, params) as AnypayServerProps

      this.amqp = props.amqp
  
      this.log = props.log
  
      this.prisma = props.prisma
  
      this.webhook_server = new WebhookServer({
        amqp: props.amqp,
        log: this.log,
        prisma: this.prisma
      })

      this.http_api_server = new HttpApiServer({
        http: {
            host: props.http.host,
            port: props.http.port
        },
        log: this.log
      })
      
    }
  
    start() {

      this.webhook_server.start()

      this.http_api_server.start()

      this.websocket_server = buildServer({ listener: this.http_api_server.server!.listener })

      this.websocket_server.start()

    }
  }