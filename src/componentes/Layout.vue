<template>
  <Navbar />
  <RouterView />
</template>

<script>
import Navbar from './Navbar.vue';
import { useGlobalStore } from '@/stores/global';
// import { mapStores } from 'pinia'
import areaService from './servicios/areaService';
import usuariosService from './servicios/usuariosService';
import rolService from './servicios/rolService';
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
   methods:{
    async loadAreasYUsuarios(){
      const areas = await areaService.getAllArea();
      const usuarios = await usuariosService.getAllUsuarios();
      const roles = await rolService.getAllRol()
      console.log(roles, "roles en layout")
      this.globalStore.cargarAreasYUser(areas, usuarios,roles);
    }
  }
};
</script>
