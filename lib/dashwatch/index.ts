
import { forMonth } from './report';

export async function reportForMonth(month) {

  let report = await forMonth(month);

  return report;

}

