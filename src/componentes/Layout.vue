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

</style>
