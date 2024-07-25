export class SetDTO {
  key: string
  value: string
  options: object

  constructor(key: string, value: string, options: object) {
    this.key = key
    this.value = key
    this.options = options
  }
}
