import AuthenticatedRequest from "../../auth/AuthenticatedRequest";
import { ResponseToolkit } from "@hapi/hapi";


export async function show(request: AuthenticatedRequest, h: ResponseToolkit) {

  return h.response({

    user: JSON.parse(JSON.stringify(request.account))

  })
  .code(200)

}

