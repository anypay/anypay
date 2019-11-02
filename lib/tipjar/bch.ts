

export async function getAddressBalance(address: string): Promise<number> {

  let resp = await
    http.get(`https://rest.bitcoin.com/v2/address/details/${address}`);

  return resp.body.unconfirmedBalance;

}


