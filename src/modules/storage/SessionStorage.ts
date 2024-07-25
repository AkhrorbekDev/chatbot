import {StorageInterface} from '@/modules/storage/interface/StorageInterface';
import {GetDTO, RemoveDTO, SetDTO} from '@/modules/storage/types/types';

class SessionStorage implements StorageInterface {
  public get(options: GetDTO): string | null {
    return window.sessionStorage.getItem(options.key);
  }

  public remove(options: RemoveDTO): void {
    return window.sessionStorage.removeItem(options.key);
  }

  public set(options: SetDTO): void {
    return window.sessionStorage.setItem(options.key, options.value);
  }

}

export default SessionStorage
