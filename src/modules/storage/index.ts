import {App} from 'vue';
import Storage from '@/modules/storage/Storage';

export default {
  install: async (app: App) => {
    const storage = new Storage()
    app.provide('storage', storage)
    app.config.globalProperties.$storage = storage
    return storage
  }
}
