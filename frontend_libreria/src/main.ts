import { createApp } from 'vue'
import App from './App.vue'

// esto importa Bootstrap CSS y JS de forma global
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

createApp(App).mount('#app')