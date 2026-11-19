import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.min.css'
import '@/assets/css/bootstrap.min.css' // Ajusta la ruta según dónde los hayas guardado
import '@/assets/css/style.css' // O el archivo principal de estilos de la plantilla

import App from './App.vue'
import router from './router'

const licenseKey =
  typeof import.meta.env.VITE_LICENSE_KEY === 'string'
    ? import.meta.env.VITE_LICENSE_KEY.trim()
    : ''

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  ...(licenseKey ? { license: licenseKey } : {}),
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: 'system',
      cssLayer: false, // no tendrá capas de css
    },
  },
})

app.mount('#app')
