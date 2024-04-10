import { PrismaClient } from "@prisma/client";
import { WebhookServer } from "./webhooks/server";
import { Logger } from "../lib/log";

interface AnypayServerProps {
    webhook_server: {
      amqp: {
        url: string
        exchange: string
      }
    }
    log: Logger;
    prisma: PrismaClient;
  }
  

export class AnypayServer {

    log: Logger;
  
    prisma: PrismaClient;
  
    webhook_server: WebhookServer
  
    constructor(props: AnypayServerProps) {
  
      this.log = props.log
  
      this.prisma = props.prisma
  
      this.webhook_server = new WebhookServer({
        ...props.webhook_server,
        log: this.log,
        prisma: this.prisma
      })
    }
  
    start() {
      this.webhook_server.start()
    }
  }