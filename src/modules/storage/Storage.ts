import CookieStorage from '@/modules/storage/CookieStorage';
import {GetDTO, RemoveDTO, SetDTO} from '@/modules/storage/types/types';

export class Storage {
  $storage: any
  $platform: any

  constructor() {
    this.$storage = new CookieStorage()
  }

  get(options: GetDTO) {
    // @ts-ignore
    return this.$storage.get(options)
  }

  set(options: SetDTO) {
    return this.$storage.set(options)
  }

  remove(options: RemoveDTO) {
    return this.$storage.remove(options)
  }


}

export default Storage
