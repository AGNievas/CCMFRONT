<template>
  <Navbar />
  <RouterView />
</template>

<script>
import Navbar from './Navbar.vue';
import { useGlobalStore } from '@/stores/global';
import areaService from './servicios/areaService';
import usuariosService from './servicios/usuariosService';
import rolService from './servicios/rolService';
import stockAreaService from './servicios/stockAreaService';
export default {
  components: {
    Navbar,
  },
  data() {
    return {
      isSessionActive: false,
      globalStore: useGlobalStore(),
    };
  },
  async mounted() {
    this.isSessionActive = this.globalStore.getLogueado;
    this.loadAreasYUsuarios()

  },
  methods: {
    async loadAreasYUsuarios() {
      if (this.globalStore.getLogueado) {
        const areas = await areaService.getAllArea();
        const stockAreas = await stockAreaService.getAllStockArea();
        const usuarios = await usuariosService.getAllUsuarios();
        const roles = await rolService.getAllRol()
        this.globalStore.cargarAreasYUser(areas, usuarios, roles, stockAreas);
      }

    }
  }
};
</script>
