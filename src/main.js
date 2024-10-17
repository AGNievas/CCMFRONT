import { createApp } from 'vue';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { es } from 'vuetify/locale';

// Asegúrate de importar los estilos de mdi
import '@mdi/font/css/materialdesignicons.css'; // Línea agregada para importar los íconos
import './assets/global.css';

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
    locale: {
        locale: 'es',    // Establecer idioma predeterminado como español
        messages: { es }, // Definir las traducciones en español
    }
});

const app = createApp(App);
app.use(vuetify);
app.use(router);

app.config.globalProperties.$axios = axiosInstance;
app.mount('#app');
