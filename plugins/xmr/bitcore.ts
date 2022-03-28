
export class Transaction {

  hex: string;

  constructor(hex) {

    this.hex = hex
  }

  toJSON() {

    return { }

  }

  get hash() {

    return '12345'
  }
}
