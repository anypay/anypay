import AuthenticatedRequest from "@/server/auth/AuthenticatedRequest";
import { Request, ResponseToolkit } from "@hapi/hapi";


export async function show(request: AuthenticatedRequest | Request, h: ResponseToolkit) {

  return h.response({

    user: JSON.parse(JSON.stringify((request as AuthenticatedRequest).account))

  })
  .code(200)

}

