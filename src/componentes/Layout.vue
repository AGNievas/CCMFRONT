<template>
  <Navbar />
  <RouterView />
</template>

<script>
import Navbar from './Navbar.vue';
import { useGlobalStore } from '@/stores/global';
import { mapStores } from 'pinia'
export default {
  components: {
    Navbar,
  },
  data() {
    return {
      isSessionActive: false,

    };
  },
  mounted() {
    this.isSessionActive = this.globalStore.getLogueado;

  },


  computed: {
    ...mapStores(useGlobalStore)
  }

};
</script>

<style scoped></style>
