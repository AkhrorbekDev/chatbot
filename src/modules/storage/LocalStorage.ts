import {StorageInterface} from '@/modules/storage/interface/StorageInterface';
import {GetDTO, RemoveDTO, SetDTO} from '@/modules/storage/types/types';

class LocalStorage implements StorageInterface {
  public get(options: GetDTO): string | null {
    return window.localStorage.getItem(options.key);
  }

  public remove(options: RemoveDTO): void {
    return window.localStorage.removeItem(options.key);
  }

  public set(options: SetDTO): void {
    return window.localStorage.setItem(options.key, options.value);
  }

}

export default LocalStorage
