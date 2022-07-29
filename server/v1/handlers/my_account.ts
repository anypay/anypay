
export async function show(request, h) {

  return h.response({

    user: request.account.toJSON()

  })
  .code(200)

}

