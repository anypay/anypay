
export class Account {

  record: any;

  constructor(record: any) {

    this.record = record;
  }

  get id () {

    return this.record.id
  }

  get denomination () {

    return this.record.denomination

  }

}

