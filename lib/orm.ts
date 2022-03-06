
export type Json = any;

export interface Record {

  save: () => Promise<any>;

  toJSON: () => any;

  dataValues: any;

  updateAttributes: (any) => Promise<any>;

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

  async save() {
    return this.record.save()
  }

  async update(updates: any): Promise<Orm> {

    for (let [key, value] of Object.entries(updates)) {

      this.record[key] = value

    }

    await this.record.save()

    return this
  }

  toJSON() {
    return this.record.toJSON()
  }

  get(attribute: string): any {

    return this.record.dataValues[attribute]

  }

  async set(key: string, value: any): Promise<any> {

    this.record[key] = value

    return this.record.save()

  }

}

