
export interface Record {

  save: () => Promise<any>;

  toJSON: () => any;

  dataValues: any;

}

interface FindOrCreate {

  where: any;

  defaults: any;
}

export class Orm {

  record: Record;
  
  static model: any;

  constructor(record: Record) {

    this.record = record
  }

  static fromRecord(record: Record) {

    return new Orm(record)

  }

  static findOrCreate(params: FindOrCreate) {

    return Orm.model.findOrCreate(params)

  }

  save() {
    return this.record.save()
  }

  toJSON() {
    return this.record.toJSON()
  }

  get(attribute: string): any {

    return this.record.dataValues[attribute]

  }

}

