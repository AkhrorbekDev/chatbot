export type GetDTO = {
  key: any,
  value?: string,
  options?: {}
}
export type SetDTO = {
  key: any
  value: any
  options: any
}

export type RemoveDTO = {
  key: string
  options?: object
}

export type ConfigDTO = {
  group?: string;
}
