export class RemoveDTO {
  key: string
  options: object

  constructor(key: string, options: object) {
    this.key = key
    this.options = options
  }
}
