
import { config } from '@/lib/config'

export function getBaseURL() {

  return config.get('API_BASE')

}
