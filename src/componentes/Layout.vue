<template>
  <div>
    <Navbar v-if="isSessionActive" />
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<script>
import Navbar from './Navbar.vue';

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
    this.isSessionActive = !!localStorage.getItem('session');
  },
};
</script>

<style scoped>
.content {
  margin-top: 64px; /* Ajusta esto a la altura de tu Navbar */
  /* padding: 16px; Agregar padding si lo deseas */
  overflow-y: auto; /* Permitir desplazamiento si el contenido es largo */
}
</style>
