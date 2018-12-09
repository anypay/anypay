const Util = require("./dash/extended_public_key_util");

export async function getNextAddress(xpub) {

  let address = Util.generate(xpub.xpubkey, `m/0/${xpub.nonce}`);

  xpub.nonce = xpub.nonce + 1;

  await xpub.save();

  return address;

}

