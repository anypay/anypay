
import { sendFromAddress } from '../lib/bch/sendfromaddress';

(async () => {

  const source = "bitcoincash:qrl676c8xcahka8yls7kldle50xm8clnnuzg0mp5qg";

  const destination = "bitcoincash:qrzel964a5zuahzxg9r8m2j4a3phkytkeqa7wxnfvk";

  const amount = 0.0012;

  let resp = await sendFromAddress(source, destination, amount);

  console.log(resp);

})();

