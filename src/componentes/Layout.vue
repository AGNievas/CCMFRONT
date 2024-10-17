<template>
  <div>
    <Navbar  />
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<script>
import Navbar from './Navbar.vue';
import { useGlobalStore } from '@/stores/global';
export default {
  components: {
    Navbar,
  },
  data() {
    return {
      isSessionActive: false,
      globalStore : useGlobalStore(),
    };
  },
  mounted() {
    this.isSessionActive = this.globalStore.getLogueado;

  },
};
</script>

<style scoped>

</style>
