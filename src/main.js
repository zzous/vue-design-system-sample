import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import '@zzou/vue-design-system/dist/index.css'
import '@zzou/vue-design-system/styles'
import '@zzou/vue-design-system/datepicker-theme'
import './styles/main.scss'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(i18n)
app.mount('#app')
