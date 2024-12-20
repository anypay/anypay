
import { createHmac } from 'crypto'

export class Transaction {

  hex: string;

  constructor(hex: string) {

    this.hex = hex
  }

  toJSON() {

    return { }

  }

  get hash() {

    let hash = createHmac('sha256', Math.random().toString()).update(Math.random().toString()).digest("hex")

    return hash
  }
}
