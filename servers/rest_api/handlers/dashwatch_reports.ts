
import { dashwatch } from '../../../lib';

export async function reportForMonth(req, h) {

  let report = await dashwatch.reportForMonth(req.params.month);

  return report;

}

