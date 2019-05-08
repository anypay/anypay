
import { buildWireEmailReport } from '../../../lib/wire';

export async function show(req, h) {

  try{

    let invoiceUID = req.params.invoice_uid;

    let content = buildWireEmailReport(invoiceUID);

    return content;

  }catch(error){

     console.log(error)

  }

}

