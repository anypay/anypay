
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

  get id() {
    return this.get('id')
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

export async function findOrCreate<T>(constructor: any, params: any): Promise<[T, boolean]> {

  let [record, isNew] = await constructor.model.findOrCreate(params)

  let instance = new constructor(record)

  return [instance, isNew]

}

export async function create<T>(constructor: any, params: any): Promise<T> {

  let record = await constructor.model.create(params)

  let instance = new constructor(record)

  return instance

}

export async function findAll<T>(constructor: any, params: any): Promise<T[]> {

  let records = await constructor.model.findAll(params)

  return records.map(record => new constructor(record))

}

export async function findOne<T>(constructor: any, params: any): Promise<T | null> {

  let record = await constructor.model.findOne(params)

  if (!record) { return null }

  return new constructor(record)

}

