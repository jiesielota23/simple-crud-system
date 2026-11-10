import './bootstrap';
import { createApp } from 'vue';
import { createRulesPlugin, createVuetify } from 'vuetify'
import App from './App.vue';

const vuetify = createVuetify();

createApp(App).mount('#app').use(createRulesPlugin({ /* options */ }, vuetify.locale));
