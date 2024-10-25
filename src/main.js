import './assets/scss/main.scss'
import {createApp, ref} from 'vue';
import App from './components/App.vue'
import {vMaska} from "maska/vue"
import createAuth from "@/modules/auth";
import Storage from '@/modules/storage';

const ChatConnectionWidget = window.ChatConnectionWidget || {
    options: {
        rootId: 'app',
        defaultTheme: 'theme-light',
    }
}
const app = createApp(App, {class: ChatConnectionWidget.options.defaultTheme})
const alertOptions = ref({
    color: 'info',
    text: '',
    'open': false,
    events: {
        openModal: (statusColor, msg) => {
            let openTimeout
            let closeTimeout

            if (openTimeout) {
                clearTimeout(openTimeout)
            }
            if (closeTimeout) {
                clearTimeout(closeTimeout)
            }

            openTimeout = setTimeout(() => {
                alertOptions.value['open'] = true
                alertOptions.value.color = statusColor
                alertOptions.value.text = msg
            }, 0)

            closeTimeout = setTimeout(() => {
                alertOptions.value['open'] = false
            }, 2000)
        },
        closeModal: () => {
            alertOptions.value['open'] = false
        },
    },
})
app.provide('alertOptions', alertOptions)
app.provide('widget-options', ChatConnectionWidget.options)
    .use(Storage)


const auth = createAuth(app, ChatConnectionWidget?.options.authOptions)

app
    .directive('maska', vMaska)
    .use(auth).mount(`#${ChatConnectionWidget.options.rootId}`)
