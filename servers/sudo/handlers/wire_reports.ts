
import { buildWireEmailReport, buildReportCsvFromInvoiceUID } from '../../../lib/wire';

export async function show(req, h) {

  try{

    let invoiceUID = req.params.invoice_uid;

    let content = buildWireEmailReport(invoiceUID);

    return content;

  }catch(error){

     console.log(error)

  }

}

export async function showCSV(req, h) {

  try{

    let invoiceUID = req.params.invoice_uid;

    let content = await buildReportCsvFromInvoiceUID(invoiceUID);

    console.log('content', content);

    let response =  h.response(content).header("Content-Disposition", `attachment;filename=anypay_egifter_report_${invoiceUID}.csv`);

    return response;

  }catch(error){

     console.log(error)

     return { error: error.message }

  }

}


