#!/usr/bin/env ts-node

import * as  http from "superagent";

const token = process.env.BLOCKCYPHER_TOKEN;

async function getForwards() {
  let resp = await http
    .get(`https://api.blockcypher.com/v1/btc/main/forwards/?token=${token}`)

  return resp.body;
}

async function deleteForward(id) {
  await http
    .delete(
      `https://api.blockcypher.com/v1/btc/main/forwards/${id}?token=${token}`
    )
}

(async function() {

  let forwards = await getForwards();

  console.log(forwards);

  for (let i=0; i < forwards.length; i++) {

      let forward = forwards[i];

      console.log('delete forward', forward);

      let resp = await deleteForward(forward.id);

      console.log(resp);

  }


})();
