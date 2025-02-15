export class Service {
  public id: number;
  public name: string;
  public isDelete: boolean;


  constructor();

  constructor(id: number, name: string,isDelete: boolean);

  constructor(id?: number, name?: string, isDelete: boolean = false) {
    this.id = id || 0;
    this.name = name || '';
    this.isDelete = isDelete;
  }
}
