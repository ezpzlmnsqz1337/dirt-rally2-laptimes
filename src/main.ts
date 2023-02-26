import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import vSelect from 'vue-select';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import 'vue-select/dist/vue-select.css'
import 'flagpack/dist/flagpack.css'

const app = createApp(App)

app.use(createPinia())

app.component("v-select", vSelect);
app.component("PulseLoader", PulseLoader);

app.mount('#app')
