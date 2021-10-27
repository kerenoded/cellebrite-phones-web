export class PhoneEntities {
  arr: PhoneEntity[]
  total: number

  constructor(arr: PhoneEntity[], total: number) {
    this.arr = arr;
    this.total = total;
  }
}

export interface PhoneEntity {
    _id?: string;
    color?: string;
    type: string;
    serial: string;
    metaData: string;
    
  }

  