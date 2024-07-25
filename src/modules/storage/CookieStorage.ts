import {VueCookieNext} from 'vue-cookie-next'
import {StorageInterface} from '@/modules/storage/interface/StorageInterface';
import {GetDTO, RemoveDTO, SetDTO} from '@/modules/storage/types/types';

class CookieStorage implements StorageInterface {
    get(options: GetDTO): any {
        return VueCookieNext.getCookie(options.key)
    }

    remove(options: RemoveDTO): any {
        return VueCookieNext.removeCookie(options.key, options.options)
    }

    set(options: SetDTO): any {
        return VueCookieNext.setCookie(options.key, options.value, options.options)
    }

}

export default CookieStorage
