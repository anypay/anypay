const zAddress = 'zcLUJqYqjWrEpPJ9nFLaTrkcar2Z9NwBKpFKpSE58nQBWTe6DatVj2xT586GF5FwoT5kyECfWezgnp353b8vtijVRx4SVPH';
const tAddress = 't1Xd3MJ6mFnsidvdoLA37vwqN4Bizarqxci';

module.exports.getNewAddress = (isEncrypted) => {

  console.log('zcash:getnewaddress', `encrypted:${isEncrypted}`);

  if (isEncrypted === "true") {
    return Promise.resolve(zAddress);
  } else {
    return Promise.resolve(tAddress);
  }

}

