
import { polygon } from 'usdc'

export async function validateAddress(address: string): Promise<boolean> {

  return polygon.isAddress({ address })

}
