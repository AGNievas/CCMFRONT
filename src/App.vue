<template>
  <v-app>
    <Layout />
  </v-app>
</template>

<script>
import Layout from './componentes/Layout.vue';
import { useGlobalStore } from './stores/global';
export default {

  name: 'App',
  components: {
    Layout
  },

  created() {
    const session = sessionStorage.getItem('session');
    if (session) {
      const { cuil, usuarioId, areaId, areaNombre, fullNameUsuario, rolId, rolName, } = JSON.parse(session);
      const globalStore = useGlobalStore();
      globalStore.setUsuario(cuil, usuarioId, areaId, areaNombre, fullNameUsuario, rolId, rolName, rolId == 1, true)

    }

  },
};
</script>

<style></style>
