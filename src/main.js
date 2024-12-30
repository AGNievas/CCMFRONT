import { createApp } from "vue";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { es } from "vuetify/locale";
import { createPinia } from "pinia";

import "@mdi/font/css/materialdesignicons.css";
import "./assets/global.css";

import router from "./router";
import axiosInstance from "./axios";
import App from "./App.vue";

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  locale: {
    locale: "es",
    messages: { es },
  },
});

const app = createApp(App);
const pinia = createPinia();

app.use(vuetify);
app.use(router);
app.use(pinia);
app.config.globalProperties.$axios = axiosInstance;
app.mount("#app");
