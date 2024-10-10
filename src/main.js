import { createApp } from 'vue';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { es } from 'vuetify/locale'

// Asegúrate de importar los estilos de mdi
import '@mdi/font/css/materialdesignicons.css';

import router from './router';
import axiosInstance from './axios';
import App from './App.vue';

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    },
    locales:{
        locales: 'es',
        message: {es},
    }
});

const app = createApp(App);
app.use(vuetify);
app.use(router);
app.config.globalProperties.$axios = axiosInstance;
app.mount('#app');
