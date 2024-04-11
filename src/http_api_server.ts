import { Server } from "@hapi/hapi";
import { NewServer } from "../server/v0/server";
import { Logger } from "../lib/log";

interface HttpApiServerParams {
    http: {
        port: number;
        host: string;
    },
    log: Logger
}

export class HttpApiServer {

    server?: Server;
    
    props: HttpApiServerParams;
    
    log: Logger;
    
    constructor(params: HttpApiServerParams) {
        this.props = params;
        this.log = params.log
    }

    async start() {

        this.server = await NewServer()
        await this.server.start();

        this.log.info(`http.server.started`, this.server.info)
    }

    stop() {
        this.server?.stop()
    }
}
