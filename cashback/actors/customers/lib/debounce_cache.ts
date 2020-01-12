
const invoices = {};

function expireInvoice(uid: string) {

  setTimeout(function() {

    delete invoices[uid];

  }, 1000 * 60); // one minute

}

export function cacheInvoice(uid:string) {

  invoices[uid] = true;

  expireInvoice(uid);

}

export function isCached(uid: string) {

  if (invoices[uid]) {

    return true;

  } else {

    return false;

  }

}


