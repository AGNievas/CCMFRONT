<template>
<h1>cargaDeMedicamentos</h1>
</template>

<script>


export default {
  name: 'src-componentes-cargaDeMedicamentos',
  props: [],
  mounted() {

    this.isSessionActive = !!localStorage.getItem('session');
    const user = JSON.parse(localStorage.getItem('user'));
    this.userId = user ? user.id : null;

  },
  data() {
    return {
   
      isSessionActive: false,
      userId: null,

    }
  },
  methods: {


  }
}
</script>

<style></style>
