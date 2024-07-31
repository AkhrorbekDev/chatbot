import './assets/scss/main.scss'
import App from './components/App.vue'
import {vMaska} from "maska/vue"
import createAuth from "@/modules/auth";
import Storage from '@/modules/storage';
const vue = Vue
vue.provide('vMaska', vMaska)
vue.provide('createAuth', createAuth)
vue.provide('Storage', Storage)
export {App}
