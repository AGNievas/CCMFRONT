<template>
  <div class="home-container">
    <div class="background-image"></div>
    <div class="content">
      <h1></h1>
    </div>
  </div>
</template>

<script>
export default {
  name: 'src-componentes-home',
  components: {},
  props: [],
  methods: {},
  computed: {}
};
</script>

<style scoped lang="css">
.home-container {
  position: relative;
  height: 100vh;
  display: flex; 
  justify-content: center; 
  align-items: center;
  overflow: hidden;
}

.background-image {
  background-image: url('@/assets/logo.png'); 
  background-size: contain; 
  background-repeat: no-repeat; 
  background-position: center; 
  width: 300px;
  height: 300px; 
  opacity: 0.3; 
  position: fixed; 
  z-index: 1; 
  left: 50%;
  top: 50%; 
  transform: translate(-50%, -50%);
}

.content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: #0E3746; 
}
</style>
