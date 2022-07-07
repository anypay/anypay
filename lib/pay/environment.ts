
import { config } from '../config'

export function getBaseURL() {

  return config.get('API_BASE')

}
