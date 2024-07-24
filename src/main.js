import './assets/scss/main.scss'
import {createApp} from 'vue';
import App from './App.vue'
import {vMaska} from "maska/vue"

createApp(App).directive('maska', vMaska).mount('#app')
export {App}
