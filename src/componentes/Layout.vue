<template>
  <Navbar />
  <RouterView />
</template>

<script>
import Navbar from './Navbar.vue';
import { useGlobalStore } from '@/stores/global';
import { mapStores } from 'pinia'
import stockAreaService from './servicios/stockAreaService';
import usuariosService from './servicios/usuariosService';
export default {
  components: {
    Navbar,
  },
  data() {
    return {
      isSessionActive: false,
    };
  },
  async mounted() {
    this.isSessionActive = this.globalStore.getLogueado;
    this.globalStore.cargarAreasYUser(await stockAreaService.getAllStockArea(), await usuariosService.getAllUsuarios())
  },
  computed: {
    ...mapStores(useGlobalStore)
  }
};
</script>
