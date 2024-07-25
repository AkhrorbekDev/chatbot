import {GetDTO, RemoveDTO, SetDTO} from '@/modules/storage/types/types';

export interface StorageInterface {
  get(options: GetDTO): any

  set(options: SetDTO): any,

  remove(options: RemoveDTO): any
}

